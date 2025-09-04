// frontend/src/components/PredictionCard.jsx
import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function PredictionCard({ modelName, model }) {
  const { label, confidence, latency_ms, probs } = model;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{modelName}</h3>
        <span className="text-xs text-gray-500">{latency_ms?.toFixed(1) ?? 0} ms</span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold">{label}</span>
        <span className="text-sm text-gray-500">{(confidence * 100).toFixed(2)}%</span>
      </div>

      <div className="mt-4 space-y-2">
        {Object.entries(probs).map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between text-sm"><span>{k}</span><span>{(v * 100).toFixed(1)}%</span></div>
            <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, v * 100)}%` }} className="h-2 rounded-full bg-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

PredictionCard.propTypes = {
  modelName: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
};
