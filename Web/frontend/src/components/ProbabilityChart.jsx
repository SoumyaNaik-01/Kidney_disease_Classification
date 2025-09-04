// frontend/src/components/ProbabilityChart.jsx
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import PropTypes from "prop-types";

export default function ProbabilityChart({ ensemble }) {
  if (!ensemble) return null;
  const data = Object.entries(ensemble.probs).map(([label, value]) => ({ label, value: +(value * 100).toFixed(2) }));

  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold mb-3">Ensemble Confidence</h3>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(val) => `${val}%`} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

ProbabilityChart.propTypes = {
  ensemble: PropTypes.object,
};
