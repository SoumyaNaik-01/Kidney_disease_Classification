# backend/main.py
import os
import io
import time
import numpy as np
from typing import Dict, List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.inception_v3 import preprocess_input as inception_preprocess
from dotenv import load_dotenv

load_dotenv()  # optional .env

# Config
MODELS_DIR = os.getenv("MODELS_DIR", "models")
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
PORT = int(os.getenv("PORT", 8000))

# Models will be loaded at startup
VGG_PATH = os.path.join(MODELS_DIR, "vgg19_kidney_model.h5")
RESNET_PATH = os.path.join(MODELS_DIR, "final_resnet50_model.h5")
INCEPTION_PATH = os.path.join(MODELS_DIR, "inception_v3_kidney_model.h5")

CLASS_NAMES: List[str] = ["Cyst", "Normal", "Stone", "Tumor"]
INCEP_SIZE = (299, 299)     # match your training pipeline
VGG_RESNET_SIZE = (299, 299)

app = FastAPI(title="Kidney Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Globals
vgg19_model = None
resnet_model = None
inception_model = None


def softmax_if_needed(x: np.ndarray) -> np.ndarray:
    # if model did not include softmax, normalize here
    if np.isclose(x.sum(), 1.0, atol=1e-3):
        return x
    e = np.exp(x - np.max(x))
    return e / e.sum(axis=-1, keepdims=True)


@app.on_event("startup")
def load_models():
    global vgg19_model, resnet_model, inception_model
    for p in (VGG_PATH, RESNET_PATH, INCEPTION_PATH):
        if not os.path.exists(p):
            raise FileNotFoundError(f"Missing model file: {p}")

    print("Loading models (this may take a while)...")
    vgg19_model = load_model(VGG_PATH)
    resnet_model = load_model(RESNET_PATH)
    inception_model = load_model(INCEPTION_PATH)
    print("Models loaded.")


class ModelPred(BaseModel):
    label: str
    confidence: float
    probs: Dict[str, float]
    latency_ms: float
    input_size: List[int]


class PredictResponse(BaseModel):
    models: Dict[str, ModelPred]
    ensemble: ModelPred
    metadata: Dict[str, str]


@app.get("/")
def root():
    return {"status": "ok", "models": ["VGG19", "ResNet50", "InceptionV3"], "classes": CLASS_NAMES}


@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    try:
        img = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=415, detail="Unsupported image format")

    # Preprocess for models
    img_incep = img.resize(INCEP_SIZE)
    arr_incep = np.expand_dims(np.array(img_incep), axis=0)
    x_incep = inception_preprocess(arr_incep.copy())

    img_vr = img.resize(VGG_RESNET_SIZE)
    arr_vr = np.expand_dims(np.array(img_vr), axis=0)
    x_vr = arr_vr / 255.0

    # Per-model run helper
    def run_model(model, x, input_size):
        t0 = time.perf_counter()
        raw = model.predict(x, verbose=0)[0]
        t1 = time.perf_counter()
        probs = softmax_if_needed(raw)
        idx = int(np.argmax(probs))
        return {
            "label": CLASS_NAMES[idx],
            "confidence": float(probs[idx]),
            "probs": {CLASS_NAMES[i]: float(probs[i]) for i in range(len(CLASS_NAMES))},
            "latency_ms": (t1 - t0) * 1000.0,
            "input_size": [input_size[0], input_size[1], 3],
        }

    vgg_out = run_model(vgg19_model, x_vr, VGG_RESNET_SIZE)
    resnet_out = run_model(resnet_model, x_vr, VGG_RESNET_SIZE)
    incep_out = run_model(inception_model, x_incep, INCEP_SIZE)

    # Ensemble: mean of probabilities
    probs_stack = np.vstack([
        np.array(list(vgg_out["probs"].values())),
        np.array(list(resnet_out["probs"].values())),
        np.array(list(incep_out["probs"].values()))
    ])
    mean_probs = probs_stack.mean(axis=0)
    ens_idx = int(np.argmax(mean_probs))
    ensemble = {
        "label": CLASS_NAMES[ens_idx],
        "confidence": float(mean_probs[ens_idx]),
        "probs": {CLASS_NAMES[i]: float(mean_probs[i]) for i in range(len(CLASS_NAMES))},
        "latency_ms": vgg_out["latency_ms"] + resnet_out["latency_ms"] + incep_out["latency_ms"],
        "input_size": [299, 299, 3],
    }

    response = {
        "models": {
            "VGG19": vgg_out,
            "ResNet50": resnet_out,
            "InceptionV3": incep_out,
        },
        "ensemble": ensemble,
        "metadata": {"received_filename": file.filename, "orig_w": str(img.width), "orig_h": str(img.height)}
    }

    return response