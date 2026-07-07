export const uid = () => Math.random().toString(36).slice(2, 9);
export const fmt = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
export const todayStr = () => new Date().toISOString().slice(0, 10);
