interface FloatingPNL {
  currentPrice: number;
  openPrice: number;
  investment: number;
  multiplier: number;
  side: number;
  costs: number;
}

function calculateFloatingProfitAndLoss({
  costs,
  currentPrice,
  investment,
  multiplier,
  openPrice,
  side,
}: FloatingPNL) {
  return +(
    (currentPrice / openPrice - 1) * investment * multiplier * side +
    costs
  ).toFixed(2);
}

export default calculateFloatingProfitAndLoss;
