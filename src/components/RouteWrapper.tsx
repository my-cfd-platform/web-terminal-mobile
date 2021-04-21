import React, {FunctionComponent, FC, useEffect} from 'react';
import { Route, Redirect } from 'react-router';
import Page from '../constants/Pages';
import { RouteLayoutType } from '../constants/routesList';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { LAST_PAGE_VISITED, LOCAL_IS_NEW_USER } from '../constants/global';
import { unparsingSearchUrl } from '../helpers/unparsingSearchUrl';
import { useHistory } from 'react-router-dom';

interface IProps {
  component: FunctionComponent<any>;
  layoutType: RouteLayoutType;
}

type Props = IProps;

const RouteWrapper: FC<Props> = observer((props) => {
  const { component: Component, layoutType, ...otherProps } = props;
  const { mainAppStore } = useStores();
  const { push } = useHistory();
  const isOldUser = localStorage.getItem(LOCAL_IS_NEW_USER);

  useEffect(() => {
    if (location.search.length > 0) {
      const params = new URLSearchParams(location.search);
      const unParsedData = unparsingSearchUrl(params);
      mainAppStore.setParamsAsset(unParsedData.paramsAsset);
      mainAppStore.setParamsMarkets(unParsedData.paramsMarkets);
      mainAppStore.setParamsPortfolioActive(unParsedData.paramsPortfolioActive);
      mainAppStore.setParamsPortfolioOrder(unParsedData.paramsPortfolioOrder);
      mainAppStore.setParamsPortfolioHistory(unParsedData.paramsPortfolioHistory);
      mainAppStore.setParamsPortfolioTab(unParsedData.paramsPortfolioTab);
      mainAppStore.setParamsKYC(unParsedData.paramsKYC);
      mainAppStore.setParamsWithdraw(unParsedData.paramsWithdraw);
      mainAppStore.setParamsBalanceHistory(unParsedData.paramsBalanceHistory);
      mainAppStore.setParamsSecurity(unParsedData.paramsSecurity);
      if (mainAppStore.isAuthorized) {
        mainAppStore.setParamsDeposit(unParsedData.paramsDeposit);
      }
      if (unParsedData.status === null && mainAppStore.isAuthorized) {
        push(Page.DASHBOARD);
      }
    } else {
      mainAppStore.setParamsPortfolioHistory(null);
    }
  }, []);

  if (layoutType !== RouteLayoutType.Public) {
    if (mainAppStore.isAuthorized && layoutType === RouteLayoutType.SignFlow) {
      const lastPage = localStorage.getItem(LAST_PAGE_VISITED);
      return <Redirect to={lastPage || Page.DASHBOARD} />;
    } else if (
      !mainAppStore.isAuthorized &&
      [RouteLayoutType.Authorized, RouteLayoutType.KYC].includes(layoutType)
    ) {
      return <Redirect to={isOldUser ? Page.SIGN_IN : Page.SIGN_UP} />;
    }
  }

  return (
    <Route
      {...otherProps}
      render={(routeProps) => <Component {...routeProps} />}
    />
  );
});

export default RouteWrapper;
