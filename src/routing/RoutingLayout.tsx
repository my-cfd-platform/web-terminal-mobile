import React, { FC } from 'react';
import routesList, { RouteLayoutType } from '../constants/routesList';
import RouteWrapper from '../components/RouteWrapper';
import { useLocation, matchPath, Switch, useHistory, Redirect } from 'react-router-dom';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import LoaderFullscreen from '../components/LoaderFullscreen';
import { Observer } from 'mobx-react-lite';
import AuthorizedContainer from '../containers/AuthorizedContainer';
import SignFlowLayout from '../components/SignFlowLayout';
import NetworkErrorPopup from '../components/NetworkErrorPopup';
import Page from '../constants/Pages';

const RoutingLayout: FC = () => {
  const location = useLocation();
  const { push } = useHistory();
  const { mainAppStore, serverErrorPopupStore } = useStores();

  const allRoutes = routesList.map((route) => (
    <RouteWrapper key={route.path} {...route} />
  ));
  const currentRoute = routesList.find((item) => {
    const match = matchPath(location.pathname, item.path);
    return match && match.isExact;
  });

  let layoutType = RouteLayoutType.Page404;

  if (currentRoute) {
    layoutType = currentRoute.layoutType;
  } else {
    push(Page.DASHBOARD)
  }

  switch (layoutType) {
    case RouteLayoutType.Authorized:
      return (
        <AuthorizedContainer>
          {!location.search && <Redirect to={location.pathname.replace(/\/+$/, "")} />}
          <Observer>{() => <Switch>{allRoutes}</Switch>}</Observer>
        </AuthorizedContainer>
      );

    case RouteLayoutType.SignFlow:
      return (
        <SignFlowLayout>
          {!location.search && <Redirect to={location.pathname.replace(/\/+$/, "")} />}
          <Observer>
            {() => (
              <>
                {!mainAppStore.isInitLoading && <Switch>{allRoutes}</Switch>}
                <LoaderFullscreen
                  isLoading={mainAppStore.isInitLoading}
                ></LoaderFullscreen>
              </>
            )}
          </Observer>
        </SignFlowLayout>
      );

    default:
      return (
        <FlexContainer height="100%" width="100%">
          {!location.search && <Redirect to={location.pathname.replace(/\/+$/, "")} />}
          <Observer>
            {() => (
              <>{serverErrorPopupStore.isActive && <NetworkErrorPopup />}</>
            )}
          </Observer>
          <Observer>{() => <NetworkErrorPopup />}</Observer>
          <Observer>
            {() => (
              <>
                {!mainAppStore.isInitLoading && <Switch>{allRoutes}</Switch>}
                <LoaderFullscreen
                  isLoading={mainAppStore.isInitLoading}
                ></LoaderFullscreen>
              </>
            )}
          </Observer>
        </FlexContainer>
      );
  }
};

export default RoutingLayout;
