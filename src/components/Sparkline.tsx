"use client";
import React, { useMemo } from "react";

type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  showArea?: boolean;
  className?: string;
  title?: string;
};

function normalize(data: number[], w: number, h: number) {
  if (data.length === 0) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const dx = w / Math.max(1, data.length - 1);
  const range = Math.max(1e-6, max - min);
  return data
    .map((y, i) => {
      const x = i * dx;
      // invert Y so higher values are higher on the chart
      const ny = h - ((y - min) / range) * h;
      return `${x.toFixed(2)},${ny.toFixed(2)}`;
    })
    .join(" ");
}

export default function Sparkline({
  data,
  width = 180,
  height = 48,
  strokeWidth = 2,
  showArea = true,
  className,
  title,
}: SparklineProps) {
  const points = useMemo(() => normalize(data, width, height), [data, width, height]);

  // Build path for area fill under the line
  const areaPath = useMemo(() => {
    if (!points) return "";
    const first = "0," + height.toFixed(2);
    const last = width.toFixed(2) + "," + height.toFixed(2);
    return `M ${first} L ${points} L ${last} Z`;
  }, [points, width, height]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={title || "Sparkline"}
    >
      <defs>
        <linearGradient id="spark-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="1" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {showArea && points && (
        <path d={areaPath} fill="url(#spark-fill)" />
      )}

      {points && (
        <polyline
          points={points}
          fill="none"
          stroke="url(#spark-stroke)"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
