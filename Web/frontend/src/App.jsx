// frontend/src/App.jsx
import React, { useState } from "react";
import UploadBox from "./components/UploadBox";
import PredictionCard from "./components/PredictionCard";
import ProbabilityChart from "./components/ProbabilityChart";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  const onResult = (data) => {
    if (!data) {
      setToast("No response from server");
      return;
    }
    setResult(data);
    setShowRecommendations(false);
  };

  // ✅ Detailed prediction explanation
  const getDetailedExplanation = (label) => {
    switch (label?.toLowerCase()) {
      case "normal":
        return "Your kidneys appear healthy. They are efficiently filtering waste and maintaining fluid balance.";
      case "cyst":
        return "A simple kidney cyst has been detected. Most are harmless but should be monitored periodically.";
      case "tumor":
        return "Signs of a kidney tumor are detected. It may be benign or malignant. Immediate medical evaluation is crucial.";
      case "stone":
        return "Kidney stones are detected. They can cause pain, urinary blockage, and infection if untreated.";
      default:
        return "Please consult a medical professional for an accurate diagnosis.";
    }
  };

  // ✅ Prevention tips based on label (modified for normal kidney)
  const getPreventionTips = (label) => {
    switch (label?.toLowerCase()) {
      case "normal":
        return {
          lifestyle: [],
          diet: [],
          note: "✅ Great news! Your kidneys look healthy. Maintain a balanced lifestyle, stay hydrated, and go for regular health checkups to keep them functioning well."
        };
      case "cyst":
        return {
          lifestyle: [
            "Get periodic ultrasounds to track cyst growth.",
            "Avoid overuse of NSAIDs (painkillers).",
            "Manage blood pressure carefully."
          ],
          diet: [
            "Maintain a balanced low-protein diet.",
            "Reduce salty and packaged foods.",
            "Drink sufficient water but avoid overhydration."
          ]
        };
      case "tumor":
        return {
          lifestyle: [
            "Seek immediate consultation with a nephrologist/oncologist.",
            "Quit smoking completely — it doubles tumor risks.",
            "Schedule follow-up scans for early detection."
          ],
          diet: [
            "Avoid processed and fried foods.",
            "Eat antioxidant-rich fruits and vegetables.",
            "Reduce red meat consumption significantly."
          ]
        };
      case "stone":
        return {
          lifestyle: [
            "Stay physically active to prevent mineral deposits.",
            "Monitor urine color and volume.",
            "Seek medical help if pain persists."
          ],
          diet: [
            "Drink 3L+ water daily to flush out crystals.",
            "Avoid oxalate-rich foods like spinach, nuts, tea.",
            "Limit salt and red meat intake."
          ]
        };
      default:
        return { lifestyle: [], diet: [], note: "" };
    }
  };

  // ✅ Medical tests & treatments for risky predictions
  const getDoctorRecommendations = (label) => {
    if (label?.toLowerCase() === "tumor") {
      return [
        "🔬 Recommended Tests: CT scan, MRI, Biopsy",
        "💊 Possible Treatment: Partial/complete nephrectomy",
        "👨‍⚕️ Consult: Oncologist + Nephrologist",
        "⚠ Early diagnosis improves recovery rates significantly."
      ];
    } else if (label?.toLowerCase() === "stone") {
      return [
        "🔬 Recommended Tests: Ultrasound, CT scan, Urine analysis",
        "💊 Possible Treatment: Pain relievers, Lithotripsy, Surgery (if severe)",
        "👨‍⚕️ Consult: Urologist",
        "💡 Prevention: Stay hydrated, low-salt diet."
      ];
    }
    return [];
  };

  // ✅ Informational cards for general education
  const kidneyInfo = [
    {
      title: "Normal Kidney",
      desc: "Filters blood, removes toxins, and maintains fluid balance.",
      color: "bg-green-100 text-green-800",
      warning: "No issues detected — maintain healthy habits."
    },
    {
      title: "Kidney Cyst",
      desc: "Fluid-filled sacs that are usually harmless but need monitoring.",
      color: "bg-yellow-100 text-yellow-800",
      warning: "Follow up with scans if size increases."
    },
    {
      title: "Kidney Tumor",
      desc: "Abnormal tissue growth. Can be benign or malignant.",
      color: "bg-red-100 text-red-800",
      warning: "⚠ Immediate medical consultation is advised."
    },
    {
      title: "Kidney Stone",
      desc: "Hard deposits of minerals causing pain and urinary blockage.",
      color: "bg-blue-100 text-blue-800",
      warning: "Stay hydrated and consult a doctor if symptoms persist."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">🩺 Kidney Predictor</h1>
          <p className="text-sm text-gray-500">
            Upload CT image — get predictions from three models + ensemble
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <UploadBox onResult={onResult} setToast={setToast} />

        {/* Prediction Insights */}
        <div className="space-y-4">
          {result && (
            <>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Ensemble Prediction</div>
                    <div className="text-xl font-semibold">
                      {result.ensemble.label}{" "}
                      <span className="text-sm text-gray-500">
                        ({(result.ensemble.confidence * 100).toFixed(2)}%)
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Latency: {(result.ensemble.latency_ms || 0).toFixed(1)} ms
                    </div>
                  </div>
                </div>

                {/* Detailed Explanation */}
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  {getDetailedExplanation(result.ensemble.label)}
                </p>

                {/* Show prevention tips only if not normal */}
                {result.ensemble.label.toLowerCase() !== "normal" ? (
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      🛡 Prevention Tips:
                    </h3>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {getPreventionTips(result.ensemble.label).lifestyle.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                      {getPreventionTips(result.ensemble.label).diet.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900 rounded-md border border-green-300 dark:border-green-700">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {getPreventionTips(result.ensemble.label).note}
                    </p>
                  </div>
                )}

                {/* Doctor Recommendations for risky cases */}
                {["tumor", "stone"].includes(result.ensemble.label.toLowerCase()) && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowRecommendations(!showRecommendations)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-md transition"
                    >
                      {showRecommendations ? "Hide Recommendations" : "View Doctor Recommendations"}
                    </button>
                    {showRecommendations && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900 rounded-md border border-red-300 dark:border-red-700">
                        <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                          Doctor’s Advice:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {getDoctorRecommendations(result.ensemble.label).map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Probability Chart */}
              <ProbabilityChart ensemble={result.ensemble} />
            </>
          )}
        </div>

        {/* Model-Specific Predictions */}
        {result && (
          <section className="md:col-span-2 grid md:grid-cols-3 gap-6 mt-4">
            {Object.entries(result.models).map(([name, m]) => (
              <PredictionCard key={name} modelName={name} model={m} />
            ))}
          </section>
        )}

        {/* Educational Cards */}
        <section className="md:col-span-2 mt-10">
          <h2 className="text-xl font-bold mb-4">ℹ️ About Kidney Conditions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {kidneyInfo.map((info, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-md p-4 ${info.color} transition-transform transform hover:scale-105`}
              >
                <h3 className="font-semibold mb-2">{info.title}</h3>
                <p className="text-sm mb-2">{info.desc}</p>
                <p className="text-xs font-medium">{info.warning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* General Kidney Health Guide */}
        <section className="md:col-span-2 mt-10 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-3">💡 General Kidney Health Tips</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Drink at least 2.5–3 liters of water daily to flush toxins.</li>
            <li>Limit processed food, alcohol, and sugary beverages.</li>
            <li>Get annual health checkups to monitor kidney function.</li>
            <li>Control diabetes and high blood pressure to prevent kidney damage.</li>
            <li>Avoid overusing painkillers and antibiotics without prescription.</li>
          </ul>
        </section>
      </main>

      {/* Toast Messages */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div>{toast}</div>
            <button
              onClick={() => setToast("")}
              className="text-white/80 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
