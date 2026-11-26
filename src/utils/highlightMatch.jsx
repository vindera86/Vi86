import React from 'react';

/**
 * Highlights case-insensitive occurrences of `query` inside `text`
 * when `query` is at least 2 characters long.
 */
export function highlightMatch(text, query) {
  if (!text) return text;
  const trimmed = query ? query.trim() : '';
  if (trimmed.length < 2) return text;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = String(text).split(regex);
  if (parts.length === 1) return text;

  const lower = trimmed.toLowerCase();
  return parts.map((part, idx) =>
    part.toLowerCase() === lower ? (
      <mark
        key={idx}
        className="bg-amberGold-400/35 text-amberGold-950 dark:bg-amberGold-400/25 dark:text-amberGold-200 rounded px-0.5 font-semibold"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * Splits `text` by `/` or `|` and returns the segment matching `query` (if >= 2 chars),
 * falling back to the first segment.
 */
export function pickMatchingPart(text, query) {
  if (!text) return '';
  const str = String(text);
  const sep = str.includes('|') ? /\s*\|\s*/ : /\s*\/\s*/;
  const parts = str
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return '';
  const q = query ? query.trim().toLowerCase() : '';
  if (q.length >= 2) {
    const match = parts.find((p) => p.toLowerCase().includes(q));
    if (match) return match;
  }
  return parts[0];
}
