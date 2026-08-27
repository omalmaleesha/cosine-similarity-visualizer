/**
 * VectorGraph what We Done Here
 * Interactive 2D vector plane for the Cosine Similarity visualizer.
 * 
 * What this component does:
 * - Renders a clean Cartesian plane with grid, axes, and numeric ticks
 * - Draws two draggable vectors (A = blue, B = green) from the origin
 * - Shows a dashed amber arc representing the angle θ between them
 * - Converts screen pointer coordinates ↔ vector space (and vice-versa)
 * - Live-updates parent state so FormulaDisplay / Controls stay in sync
 * 
 * Design notes (the upgrade):
 * - Tailwind-only styling (no inline style objects)
 * - Professional math-tool aesthetic: zinc surfaces, monospace labels,
 *   restrained colors, thin precise strokes — not cartoonish
 * - Proper unit ticks (−8 … 8) so the scale is readable
 * - Pointer-capture drag for smooth mouse + touch interaction
 * - Live coordinate readout in the legend
 */

import { useRef } from "react";
import type { Vector2D } from "../types/vector";

interface VectorGraphProps {
  vectorA: Vector2D;
  vectorB: Vector2D;
  onVectorAChange: (vector: Vector2D) => void;
  onVectorBChange: (vector: Vector2D) => void;
  angle: number;
}

const WIDTH = 640;
const HEIGHT = 480;
const SCALE = 36;
const ORIGIN_X = WIDTH / 2;
const ORIGIN_Y = HEIGHT / 2;

function toScreen(v: Vector2D) {
  return {
    x: ORIGIN_X + v.x * SCALE,
    y: ORIGIN_Y - v.y * SCALE,
  };
}

function toVector(clientX: number, clientY: number, svg: SVGSVGElement) {
  const rect = svg.getBoundingClientRect();
  const x = (clientX - rect.left - ORIGIN_X) / (rect.width / WIDTH) / SCALE;
  const y = -(clientY - rect.top - ORIGIN_Y) / (rect.height / HEIGHT) / SCALE;
  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  };
}

export default function VectorGraph({
  vectorA,
  vectorB,
  onVectorAChange,
  onVectorBChange,
  angle,
}: VectorGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const pointA = toScreen(vectorA);
  const pointB = toScreen(vectorB);

  function handlePointerDown(
    event: React.PointerEvent<SVGCircleElement>,
    which: "A" | "B"
  ) {
    const svg = svgRef.current;
    if (!svg) return;

    event.currentTarget.setPointerCapture(event.pointerId);

   const onMove = (e: PointerEvent) => {
    const next = toVector(e.clientX, e.clientY, svg);
        if (which === "A") {
            onVectorAChange(next);
        } else {
            onVectorBChange(next);
        }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  // Angle arc
  const arcR = 48;
  const aA = Math.atan2(-vectorA.y, vectorA.x);
  const aB = Math.atan2(-vectorB.y, vectorB.x);
  const startX = ORIGIN_X + arcR * Math.cos(aA);
  const startY = ORIGIN_Y + arcR * Math.sin(aA);
  const endX = ORIGIN_X + arcR * Math.cos(aB);
  const endY = ORIGIN_Y + arcR * Math.sin(aB);

  const delta =
    ((aB - aA + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  const sweep = delta > 0 ? 1 : 0;

  // Grid range (roughly ±8 units)
  const ticks = Array.from({ length: 17 }, (_, i) => i - 8);

  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-zinc-100">
            Vector plane
          </h2>
          <p className="mt-0.5 text-[12px] text-zinc-500">
            Drag the endpoints of A or B
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[13px] text-amber-400">
          <span className="text-amber-500/70">θ</span>
          <span>{angle.toFixed(2)}°</span>
        </div>
      </div>

      {/* Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none rounded-lg border border-zinc-800/80 bg-[#0c0c0e]"
        style={{ minHeight: 400 }}
      >
        <defs>
          <marker
            id="arrow-a"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#60a5fa" />
          </marker>
          <marker
            id="arrow-b"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#4ade80" />
          </marker>
        </defs>

        {/* Minor grid */}
        {ticks.map((t) => {
          const o = t * SCALE;
          return (
            <g key={t}>
              <line
                x1={ORIGIN_X + o}
                y1={0}
                x2={ORIGIN_X + o}
                y2={HEIGHT}
                stroke="#1a1a1c"
                strokeWidth={1}
              />
              <line
                x1={0}
                y1={ORIGIN_Y + o}
                x2={WIDTH}
                y2={ORIGIN_Y + o}
                stroke="#1a1a1c"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={0}
          y1={ORIGIN_Y}
          x2={WIDTH}
          y2={ORIGIN_Y}
          stroke="#3f3f46"
          strokeWidth={1.5}
        />
        <line
          x1={ORIGIN_X}
          y1={0}
          x2={ORIGIN_X}
          y2={HEIGHT}
          stroke="#3f3f46"
          strokeWidth={1.5}
        />

        {/* Axis ticks + labels */}
        {ticks
          .filter((t) => t !== 0)
          .map((t) => {
            const sx = ORIGIN_X + t * SCALE;
            const sy = ORIGIN_Y - t * SCALE;
            return (
              <g key={`tick-${t}`}>
                {/* x-tick */}
                <line
                  x1={sx}
                  y1={ORIGIN_Y - 4}
                  x2={sx}
                  y2={ORIGIN_Y + 4}
                  stroke="#52525b"
                  strokeWidth={1}
                />
                <text
                  x={sx}
                  y={ORIGIN_Y + 16}
                  textAnchor="middle"
                  className="fill-zinc-600"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                >
                  {t}
                </text>
                {/* y-tick */}
                <line
                  x1={ORIGIN_X - 4}
                  y1={sy}
                  x2={ORIGIN_X + 4}
                  y2={sy}
                  stroke="#52525b"
                  strokeWidth={1}
                />
                <text
                  x={ORIGIN_X - 12}
                  y={sy + 3}
                  textAnchor="end"
                  className="fill-zinc-600"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                >
                  {t}
                </text>
              </g>
            );
          })}

        {/* Axis labels */}
        <text
          x={WIDTH - 14}
          y={ORIGIN_Y - 10}
          className="fill-zinc-500"
          fontSize={12}
          fontFamily="ui-monospace, monospace"
        >
          x
        </text>
        <text
          x={ORIGIN_X + 10}
          y={16}
          className="fill-zinc-500"
          fontSize={12}
          fontFamily="ui-monospace, monospace"
        >
          y
        </text>

        {/* Angle arc */}
        <path
          d={`M ${startX} ${startY} A ${arcR} ${arcR} 0 0 ${sweep} ${endX} ${endY}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          opacity={0.85}
        />

        {/* Vectors */}
        <line
          x1={ORIGIN_X}
          y1={ORIGIN_Y}
          x2={pointA.x}
          y2={pointA.y}
          stroke="#60a5fa"
          strokeWidth={2.5}
          markerEnd="url(#arrow-a)"
        />
        <line
          x1={ORIGIN_X}
          y1={ORIGIN_Y}
          x2={pointB.x}
          y2={pointB.y}
          stroke="#4ade80"
          strokeWidth={2.5}
          markerEnd="url(#arrow-b)"
        />

        {/* Draggable endpoints */}
        <circle
          cx={pointA.x}
          cy={pointA.y}
          r={9}
          fill="#60a5fa"
          stroke="#0c0c0e"
          strokeWidth={2}
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => handlePointerDown(e, "A")}
        />
        <circle
          cx={pointB.x}
          cy={pointB.y}
          r={9}
          fill="#4ade80"
          stroke="#0c0c0e"
          strokeWidth={2}
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => handlePointerDown(e, "B")}
        />

        {/* Labels */}
        <text
          x={pointA.x + 12}
          y={pointA.y - 10}
          className="fill-blue-300"
          fontSize={13}
          fontWeight={500}
          fontFamily="ui-monospace, monospace"
        >
          A
        </text>
        <text
          x={pointB.x + 12}
          y={pointB.y - 10}
          className="fill-emerald-300"
          fontSize={13}
          fontWeight={500}
          fontFamily="ui-monospace, monospace"
        >
          B
        </text>

        {/* Origin */}
        <circle cx={ORIGIN_X} cy={ORIGIN_Y} r={3.5} fill="#a1a1aa" />

        {/* θ label near arc */}
        <text
          x={ORIGIN_X + 58}
          y={ORIGIN_Y - 8}
          className="fill-amber-400/90"
          fontSize={12}
          fontFamily="ui-monospace, monospace"
        >
          θ
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5 text-[12px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="font-mono text-zinc-300">A</span>
          <span className="text-zinc-600">
            ({vectorA.x.toFixed(2)}, {vectorA.y.toFixed(2)})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-zinc-300">B</span>
          <span className="text-zinc-600">
            ({vectorB.x.toFixed(2)}, {vectorB.y.toFixed(2)})
          </span>
        </div>
      </div>
    </div>
  );
}