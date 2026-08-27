/**
 * VectorControls what We Done Here
 * Numeric + slider controls for the two vectors in the Cosine Similarity visualizer.
 *
 * What this component does:
 * - Lets the user edit aₓ, aᵧ, bₓ, bᵧ via number inputs or range sliders
 * - Clamps every value to the shared range −6 … 6
 * - Shows live magnitude |A| and |B| for instant feedback
 * - Keeps parent state in sync so the graph and formula update in real time
 *
 * Design notes (the upgrade):
 * - Tailwind-only styling (no inline style objects)
 * - Dual input: type exact values or drag the slider
 * - Soft color-coded badges matching the graph (blue = A, emerald = B)
 * - Monospace / tabular numbers for a clean math-tool feel
 * - Larger, accessible slider thumbs for mouse and touch
 */

import type { Vector2D } from "../types/vector";

interface VectorControlsProps {
  vectorA: Vector2D;
  vectorB: Vector2D;
  onVectorAChange: (vector: Vector2D) => void;
  onVectorBChange: (vector: Vector2D) => void;
}

interface ComponentRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: "blue" | "emerald";
}

function ComponentRow({ label, value, onChange, color }: ComponentRowProps) {
  const accent =
    color === "blue"
      ? "focus:border-blue-500/60 focus:ring-blue-500/20"
      : "focus:border-emerald-500/60 focus:ring-emerald-500/20";

  const thumb =
    color === "blue" ? "accent-blue-400" : "accent-emerald-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="font-mono text-[13px] text-zinc-400">{label}</label>

        <input
          type="number"
          min={-6}
          max={6}
          step={0.1}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isNaN(v)) onChange(Math.min(6, Math.max(-6, v)));
          }}
          className={`w-20 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5
            text-right font-mono text-[13px] tabular-nums text-zinc-100
            outline-none transition
            focus:ring-2 ${accent}`}
        />
      </div>

      <input
        type="range"
        min={-6}
        max={6}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-zinc-950
          [&::-webkit-slider-thumb]:bg-zinc-100
          [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-zinc-950
          [&::-moz-range-thumb]:bg-zinc-100
          ${thumb}`}
      />
    </div>
  );
}

function magnitude(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export default function VectorControls({
  vectorA,
  vectorB,
  onVectorAChange,
  onVectorBChange,
}: VectorControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium tracking-tight text-zinc-100">
          Controls
        </h3>
        <p className="text-[11px] text-zinc-500">Range −6 … 6</p>
      </div>

      {/* Vector A */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 font-mono text-[13px] font-semibold text-blue-400">
              A
            </span>
            <div>
              <p className="text-[13px] font-medium text-zinc-200">Vector A</p>
              <p className="font-mono text-[11px] text-zinc-500">
                |A| = {magnitude(vectorA).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <ComponentRow
            label="aₓ"
            value={vectorA.x}
            color="blue"
            onChange={(x) => onVectorAChange({ ...vectorA, x })}
          />
          <ComponentRow
            label="aᵧ"
            value={vectorA.y}
            color="blue"
            onChange={(y) => onVectorAChange({ ...vectorA, y })}
          />
        </div>
      </section>

      {/* Vector B */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 font-mono text-[13px] font-semibold text-emerald-400">
              B
            </span>
            <div>
              <p className="text-[13px] font-medium text-zinc-200">Vector B</p>
              <p className="font-mono text-[11px] text-zinc-500">
                |B| = {magnitude(vectorB).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <ComponentRow
            label="bₓ"
            value={vectorB.x}
            color="emerald"
            onChange={(x) => onVectorBChange({ ...vectorB, x })}
          />
          <ComponentRow
            label="bᵧ"
            value={vectorB.y}
            color="emerald"
            onChange={(y) => onVectorBChange({ ...vectorB, y })}
          />
        </div>
      </section>
    </div>
  );
}