// frontend/src/components/UploadBox.jsx
import React, { useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import PropTypes from "prop-types";
import { API_BASE } from "../config";

export default function UploadBox({ onResult, setToast }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile(file) {
    if (!file) return;
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/predict`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      onResult(res.data);
    } catch (err) {
      console.error(err);
      setToast("Upload failed. Check backend or file type.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          uploadFile(f);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
          drag ? "border-blue-500 bg-blue-50/40 dark:bg-blue-500/10" : "border-gray-300 dark:border-neutral-700"
        }`}
      >
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <UploadCloud className="mx-auto mb-3" size={36} />
          <p className="text-gray-700 dark:text-gray-200 font-medium">Drag & drop a CT image</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">PNG or JPG (recommended: 299×299 or larger)</p>

          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Choose file"}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                uploadFile(f);
              }}
            />
          </div>
        </motion.div>
      </div>

      {preview && (
        <div className="mt-5">
          <img src={preview} alt="preview" className="rounded-xl max-h-80 object-contain w-full" />
        </div>
      )}
    </div>
  );
}

UploadBox.propTypes = {
  onResult: PropTypes.func.isRequired,
  setToast: PropTypes.func.isRequired,
};
