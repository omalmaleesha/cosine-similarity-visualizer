import { useMemo, useState } from "react";

import FormulaDisplay from "./components/FormulaDisplay";
import VectorControls from "./components/VectorControls";
import VectorGraph from "./components/VectorGraph";
import Explanation from "./components/Explanation";

import { cosineSimilarity } from "./utils/cosine";
import type { Vector2D } from "./types/vector";

export default function App() {
  const [vectorA, setVectorA] = useState<Vector2D>({ x: 4, y: 1 });
  const [vectorB, setVectorB] = useState<Vector2D>({ x: -1, y: 3 });

  const result = useMemo(
    () => cosineSimilarity(vectorA, vectorB),
    [vectorA, vectorB]
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* subtle top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-[11px] font-medium tracking-[0.18em] text-blue-400/90">
            INTERACTIVE MATH
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Cosine Similarity Visualizer
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
            Drag the vectors or edit their components to see how direction,
            angle, dot product, and cosine similarity relate in real time.
          </p>
        </header>

        {/* Dashboard */}
        <section className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <FormulaDisplay
              vectorA={vectorA}
              vectorB={vectorB}
              result={result}
            />

            <VectorControls
              vectorA={vectorA}
              vectorB={vectorB}
              onVectorAChange={setVectorA}
              onVectorBChange={setVectorB}
            />

            <Explanation
              similarity={result.similarity}
              angle={result.angleDegrees}
            />
          </div>

          {/* Graph */}
          <div className="min-w-0">
            <VectorGraph
              vectorA={vectorA}
              vectorB={vectorB}
              onVectorAChange={setVectorA}
              onVectorBChange={setVectorB}
              angle={result.angleDegrees}
            />
          </div>
        </section>

        {/* Education */}
        <section className="mt-16">
          <h2 className="mb-5 text-[15px] font-medium tracking-tight text-zinc-200">
            How it works
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <EduCard step="01" title="Vectors">
              Each vector is defined by an x and y component. Changing these
              values changes its direction and length.
            </EduCard>

            <EduCard step="02" title="Angle">
              The angle θ between the two vectors measures how closely they
              point in the same direction.
            </EduCard>

            <EduCard step="03" title="Similarity">
              Cosine similarity maps that relationship into a single value
              between −1 and 1.
            </EduCard>
          </div>
        </section>
      </div>
    </main>
  );
}

function EduCard({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
      <span className="font-mono text-[12px] text-blue-400/80">{step}</span>
      <h3 className="mt-2 text-[14px] font-medium text-zinc-200">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
        {children}
      </p>
    </div>
  );
}