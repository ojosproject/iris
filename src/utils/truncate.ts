/**
 * File:     utils/truncate.ts
 * Purpose:  Truncating and other related functions.
 * Authors:  Ojos Project & Iris contributors
 * License:  GNU General Public License v3.0
 */
export default function truncateText(text: string, limit: number) {
  return text.length > limit ? text.slice(0, limit).trim() + "..." : text;
}
