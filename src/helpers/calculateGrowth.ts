function calculateGrowth(bid: number, ask: number, accuracy: number = 5) {
  return +((bid + ask) * 0.5).toFixed(accuracy);
}
export default calculateGrowth;
