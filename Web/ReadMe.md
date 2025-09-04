#  Kidney Disease Classification Web App

##  Overview  
This project was a **Flask-based web application** developed to classify **kidney CT and X-ray images** into four categories:  
**Normal, Cyst, Stone, and Tumor**.  

The system was powered by **deep learning models**—**Basic CNN, VGG19, ResNet50, and InceptionV3**—which were trained on a **12,446-image dataset**. Among them, **InceptionV3** achieved the highest accuracy, while **ResNet50** offered the best trade-off between precision and efficiency.

---

##  Features  
-  **Multi-class classification** of kidney images  
-  Integrated **trained deep learning models** for predictions  
-  **Real-time image upload** and classification  
-  **Particle Swarm Optimization (PSO)**-optimized models  
-  Lightweight, responsive **Flask-based backend**  
-  **Deploy-ready architecture** for **Render / GitHub Pages**  

---

##  Deep Learning Models  

| Model        | Accuracy | Optimized with PSO | Inference Speed | Best Use Case |
|-------------|---------|---------------------|------------------|---------------|
| Basic CNN   | 98.81%  | ❌ No               | ⚡ Fast          | Benchmarking |
| VGG19       | 98.20%  | ✅ Yes             | ⏳ Slow          | Feature-rich extraction |
| ResNet50    | 99.12%  | ✅ Yes             | ⚡ Medium        | Balanced performance |
| InceptionV3 | **99.33%** | ✅ Yes         | ⏳ Moderate      | Best overall model |

---

##  Tech Stack  

- **Frontend** → HTML5, CSS3, Bootstrap  
- **Backend** → Flask (Python)  
- **Models** → TensorFlow / Keras  
- **Optimization** → Particle Swarm Optimization (PSO)  
- **Deployment** → GitHub  

---

##  Installation & Setup  

### 1️ Clone the Repository  
```bash
git clone https://github.com/SoumyaNaik-01/Kidney_disease_Classification.git
cd Kidney_disease_Classification
```
## Backend Setup (Flask)

### 2️ Create a Virtual Environment
```bash
python -m venv venv
# For Linux / Mac
source venv/bin/activate
# For Windows
venv\Scripts\activate
```

### 3️ Install Dependencies
```bash
pip install -r requirements.txt
```
### 4️ Run the Flask App
```
python app.py
```
Now at http://127.0.0.1:5000/ access the web app.

---
## Frontend Setup (Web UI)
```
npm install
# set VITE_API_BASE if backend is remote, e.g. VITE_API_BASE=https://your-backend.onrender.com
npm run dev
```
Open http://localhost:5173.

---
## Results
- Metric	Value
- Best Model	InceptionV3
- Validation Accuracy	100% (with PSO)
- Inference Time	~0.145 sec per image
- Dataset Size	12,446 CT & X-ray images

---
## Tech Stack

- Framework: Flask
- Deep Learning Models: VGG19, ResNet50, InceptionV3
- Optimization: Particle Swarm Optimization (PSO)
- Dataset: CT & X-ray Kidney Images
- Language: Python 3.10+


