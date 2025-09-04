// frontend/src/App.jsx
import React, { useState } from "react";
import UploadBox from "./components/UploadBox";
import PredictionCard from "./components/PredictionCard";
import ProbabilityChart from "./components/ProbabilityChart";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState("");

  const onResult = (data) => {
    if (!data) {
      setToast("No response from server");
      return;
    }
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">🩺 Kidney Predictor</h1>
          <p className="text-sm text-gray-500">Upload CT image — get predictions from three models + ensemble</p>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-6">
        <UploadBox onResult={onResult} setToast={setToast} />

        <div className="space-y-4">
          {result && (
            <>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Ensemble Prediction</div>
                    <div className="text-xl font-semibold">{result.ensemble.label} <span className="text-sm text-gray-500">({(result.ensemble.confidence*100).toFixed(2)}%)</span></div>
                    <div className="text-xs text-gray-400 mt-1">Latency: {(result.ensemble.latency_ms || 0).toFixed(1)} ms</div>
                  </div>
                </div>
              </div>

              <ProbabilityChart ensemble={result.ensemble} />
            </>
          )}
        </div>

        {result && (
          <section className="md:col-span-2 grid md:grid-cols-3 gap-6 mt-4">
            {Object.entries(result.models).map(([name, m]) => (
              <PredictionCard key={name} modelName={name} model={m} />
            ))}
          </section>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div>{toast}</div>
            <button onClick={() => setToast("")} className="text-white/80 hover:text-white">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}
