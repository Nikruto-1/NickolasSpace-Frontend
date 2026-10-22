export function getProcessProgress(bounds, marker) {
  let activeIndex = 0;
  const progressByStep = bounds.map((rect, index) => {
    if (rect.top <= marker) activeIndex = index;
    const end = bounds[index + 1]?.top ?? rect.bottom;
    return Math.min(1, Math.max(0, (marker - rect.top) / Math.max(1, end - rect.top)));
  });
  return { activeIndex, progressByStep };
}
