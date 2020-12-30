import React, { FunctionComponent, FC } from 'react';
import { Route, Redirect } from 'react-router';
import Page from '../constants/Pages';
import { RouteLayoutType } from '../constants/routesList';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { LAST_PAGE_VISITED, LOCAL_IS_NEW_USER } from '../constants/global';

interface IProps {
  component: FunctionComponent<any>;
  layoutType: RouteLayoutType;
}

type Props = IProps;

const RouteWrapper: FC<Props> = observer((props) => {
  const { component: Component, layoutType, ...otherProps } = props;
  const { mainAppStore } = useStores();
  const isOldUser = localStorage.getItem(LOCAL_IS_NEW_USER);

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
