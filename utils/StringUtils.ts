export const capitalize = (s: String) => {
  if (s.length === 0) return s;
  return s[0].toUpperCase() + s.slice(1);
}