interface ExplanationProps {
  similarity: number;
  angle: number;
}

export default function Explanation({ similarity, angle }: ExplanationProps) {
  const { title, description, tone } = getInsight(similarity);

  const toneStyles = {
    high: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    mid: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    low: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    neutral: "border-zinc-600/30 bg-zinc-800/40 text-zinc-400",
    opposite: "border-rose-500/20 bg-rose-500/5 text-rose-400",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5">
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[13px] font-medium ${toneStyles[tone]}`}
        >
          θ
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-medium text-zinc-100">{title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
            {description}
          </p>
          <p className="mt-3 font-mono text-[12px] text-zinc-500">
            Current angle{" "}
            <span className="text-zinc-300">{angle.toFixed(2)}°</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function getInsight(similarity: number) {
  if (similarity > 0.9) {
    return {
      title: "Nearly identical direction",
      description:
        "The vectors point in almost the same direction. Cosine similarity is very high.",
      tone: "high" as const,
    };
  }
  if (similarity > 0.5) {
    return {
      title: "Similar direction",
      description:
        "The angle between them is relatively small, so they share a clear directional relationship.",
      tone: "mid" as const,
    };
  }
  if (similarity > 0.1) {
    return {
      title: "Weakly related",
      description:
        "There is still a positive relationship, but the directions are becoming less aligned.",
      tone: "low" as const,
    };
  }
  if (similarity >= -0.1) {
    return {
      title: "Approximately perpendicular",
      description:
        "The angle is close to 90°. The vectors have almost no directional similarity.",
      tone: "neutral" as const,
    };
  }
  if (similarity > -0.5) {
    return {
      title: "Different directions",
      description:
        "The angle exceeds 90°, producing a negative cosine similarity.",
      tone: "opposite" as const,
    };
  }
  return {
    title: "Opposite directions",
    description:
      "The vectors point strongly away from each other. Cosine similarity is strongly negative.",
    tone: "opposite" as const,
  };
}