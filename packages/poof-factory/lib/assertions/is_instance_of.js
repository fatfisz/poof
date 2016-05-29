export default function isInstanceOf(value, type) {
  return (
    (typeof type === 'object' || typeof type === 'function') &&
    type !== null &&
    value instanceof type
  );
}
