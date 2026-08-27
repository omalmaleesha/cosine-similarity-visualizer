/**
 * cosine.ts what We Done Here
 * Pure math helpers for the Cosine Similarity visualizer.
 *
 * What this module does:
 * - Computes the 2-D dot product A · B
 * - Computes vector magnitude |V|
 * - Computes cosine similarity, the angle in radians, and the angle in degrees
 * - Guards against zero-length vectors and clamps floating-point drift to [-1, 1]
 *
 * All functions are pure and side-effect free so they can be used safely
 * inside useMemo or any other React calculation path.
 */

import type { CosineResult, Vector2D } from "../types/vector";

export function dotProduct(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

export function magnitude(vector: Vector2D): number {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

export function cosineSimilarity(
  a: Vector2D,
  b: Vector2D
): CosineResult {
  const dot = dotProduct(a, b);
  const magnitudeA = magnitude(a);
  const magnitudeB = magnitude(b);

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return {
      dotProduct: dot,
      magnitudeA,
      magnitudeB,
      similarity: 0,
      angleRadians: 0,
      angleDegrees: 0,
    };
  }

  let similarity = dot / (magnitudeA * magnitudeB);

  // Floating point safety
  similarity = Math.max(-1, Math.min(1, similarity));
  const angleRadians = Math.acos(similarity);
  const angleDegrees = angleRadians * (180 / Math.PI);

  return {
    dotProduct: dot,
    magnitudeA,
    magnitudeB,
    similarity,
    angleRadians,
    angleDegrees,
  };
}