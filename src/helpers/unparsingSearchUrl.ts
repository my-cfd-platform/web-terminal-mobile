import URLParams from '../constants/URLParams';

export const unparsingSearchUrl = (searchUrl: URLSearchParams) => {
  return {
    paramsAsset: searchUrl.get(URLParams.ASSET),
    paramsMarkets: searchUrl.get(URLParams.MARKETS),
    paramsPortfolioTab: searchUrl.get(URLParams.PORTFOLIO),
    paramsPortfolioActive: searchUrl.get(URLParams.PORTFOLIO_ACTIVE),
    paramsPortfolioOrder: searchUrl.get(URLParams.PORTFOLIO_PENDING),
    paramsPortfolioHistory: searchUrl.get(URLParams.PORTFOLIO_CLOSED),
    paramsDeposit: searchUrl.get(URLParams.DEPOSIT) !== null,
    status: searchUrl.get(URLParams.STATUS),
    paramsKYC: searchUrl.get(URLParams.KYC) !== null,
    paramsSecurity: searchUrl.get(URLParams.SETTINGS) !== null,
    paramsWithdraw: searchUrl.get(URLParams.WITHDRAW) !== null,
    paramsBalanceHistory: searchUrl.get(URLParams.BALANCE_HISTORY) !== null,
  };
};
