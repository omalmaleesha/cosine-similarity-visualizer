/**
 * FormulaDisplay What We Done Here
 * Live breakdown of the cosine-similarity calculation.
 *
 * What this component does:
 * - Shows the classic formula cos(θ) = (A · B) / (|A| |B|)
 * - Lists the current vectors, dot product, magnitudes, and angle
 * - Highlights the final cosine-similarity score (−1 … 1)
 *
 * Design notes (the upgrade):
 * - Tailwind-only styling (no inline style objects)
 * - Clean math-tool layout: serif formula, monospace numbers, quiet dividers
 * - Soft blue highlight on the final score so it reads as the key result
 * - Matches the zinc / restrained-color language of the rest of the visualizer
 */

import type { CosineResult, Vector2D } from "../types/vector";

interface FormulaDisplayProps {
  vectorA: Vector2D;
  vectorB: Vector2D;
  result: CosineResult;
}

export default function FormulaDisplay({
  vectorA,
  vectorB,
  result,
}: FormulaDisplayProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5">
      <h2 className="mb-4 text-[15px] font-medium tracking-tight text-zinc-100">
        Cosine similarity
      </h2>

      {/* Formula */}
      <div className="mb-5 flex items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 font-serif text-[18px] text-zinc-200">
        <span>cos(θ)</span>
        <span className="text-zinc-500">=</span>
        <span>
          A · B
          <span className="mx-1 text-zinc-500">/</span>
          |A| |B|
        </span>
      </div>

      {/* Calculation rows */}
      <div className="space-y-3 text-[13px]">
        <Row label="Vector A">
          <span className="font-mono text-zinc-300">
            ({vectorA.x.toFixed(2)}, {vectorA.y.toFixed(2)})
          </span>
        </Row>

        <Row label="Vector B">
          <span className="font-mono text-zinc-300">
            ({vectorB.x.toFixed(2)}, {vectorB.y.toFixed(2)})
          </span>
        </Row>

        <div className="h-px bg-zinc-800" />

        <Row label="Dot product A · B">
          <span className="font-mono tabular-nums text-zinc-200">
            {result.dotProduct.toFixed(3)}
          </span>
        </Row>

        <Row label="|A|">
          <span className="font-mono tabular-nums text-zinc-200">
            {result.magnitudeA.toFixed(3)}
          </span>
        </Row>

        <Row label="|B|">
          <span className="font-mono tabular-nums text-zinc-200">
            {result.magnitudeB.toFixed(3)}
          </span>
        </Row>

        <div className="h-px bg-zinc-800" />

        <Row label="Angle θ">
          <span className="font-mono tabular-nums text-amber-400">
            {result.angleDegrees.toFixed(2)}°
          </span>
        </Row>
      </div>

      {/* Final score */}
      <div className="mt-5 flex flex-col items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-4">
        <span className="text-[10px] font-medium tracking-[0.15em] text-zinc-500">
          COSINE SIMILARITY
        </span>
        <span className="font-mono text-[32px] font-semibold tabular-nums tracking-tight text-blue-400">
          {result.similarity.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      {children}
    </div>
  );
}