import React, { FC } from 'react';
import routesList, { RouteLayoutType } from '../constants/routesList';
import RouteWrapper from '../components/RouteWrapper';
import { useLocation, matchPath, Switch } from 'react-router-dom';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import LoaderFullscreen from '../components/LoaderFullscreen';
import { Observer } from 'mobx-react-lite';
import NotificationPopup from '../components/NotificationPopup';
import AuthorizedContainer from '../containers/AuthorizedContainer';
import SignFlowLayout from '../components/SignFlowLayout';
import { FULL_VH } from '../constants/global';
import DemoRealPopup from '../components/DemoRealPopup';
import NetworkErrorPopup from '../components/NetworkErrorPopup';
import ServerErrorPopup from '../components/ServerErrorPopup';

const RoutingLayout: FC = () => {
  const location = useLocation();
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
  }

  switch (layoutType) {
    case RouteLayoutType.Authorized:
      return (
        <AuthorizedContainer>
          <Observer>
            {() => (
              <>{serverErrorPopupStore.isActive && <ServerErrorPopup />}</>
            )}
          </Observer>
          <Observer>{() => <NetworkErrorPopup></NetworkErrorPopup>}</Observer>
          <Observer>
            {() => (
              <>
                {mainAppStore.isDemoRealPopup && (
                  <DemoRealPopup></DemoRealPopup>
                )}
              </>
            )}
          </Observer>
          <Observer>{() => <Switch>{allRoutes}</Switch>}</Observer>
        </AuthorizedContainer>
      );

    case RouteLayoutType.SignFlow:
      return (
        <SignFlowLayout>
          <Observer>{() => <NetworkErrorPopup />}</Observer>
          <Observer>
            {() => (
              <>{serverErrorPopupStore.isActive && <ServerErrorPopup />}</>
            )}
          </Observer>
          <Observer>{() => <NotificationPopup></NotificationPopup>}</Observer>
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
        <FlexContainer
          maxHeight={`calc(${FULL_VH})`}
          height={`calc(${FULL_VH})`}
          width="100%"
        >
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
