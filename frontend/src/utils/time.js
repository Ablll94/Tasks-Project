export const formatRemaining = (deadline) => {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (d > 0) return `باقي ${d} يوم و ${h} ساعة`;
  if (h > 0) return `باقي ${h} ساعة و ${m} دقيقة`;
  return `باقي ${m} دقيقة`;
};
