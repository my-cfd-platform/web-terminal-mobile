import React, { FC } from 'react';
import routesList, { RouteLayoutType } from '../constants/routesList';
import RouteWrapper from '../components/RouteWrapper';
import { useLocation, matchPath, Switch } from 'react-router-dom';
import { FlexContainer } from '../styles/FlexContainer';
import { useStores } from '../hooks/useStores';
import LoaderFullscreen from '../components/LoaderFullscreen';
import { Observer } from 'mobx-react-lite';
import NotificationPopup from '../components/NotificationPopup';
import NotificationActivePositionPopup from '../components/NotificationActivePositionPopup';
import ChartContainer from '../containers/ChartContainer';
import NavBar from '../components/NavBar/NavBar';
import NavigationPanel from '../components/NavigationPanel';

const RoutingLayout: FC = () => {
  const location = useLocation();
  const { mainAppStore } = useStores();

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
        <FlexContainer
          position="relative"
          width="100vw"
          height="100vh"
          flexDirection="column"
          overflow="hidden"
        >
          <Observer>
            {() => (
              <>
                <NotificationPopup></NotificationPopup>
                <NotificationActivePositionPopup></NotificationActivePositionPopup>
              </>
            )}
          </Observer>
          <NavBar />
          <FlexContainer height="calc(100vh - 128px)" flexDirection="column">
            <Observer>{() => <Switch>{allRoutes}</Switch>}</Observer>
            <Observer>{() => <ChartContainer />}</Observer>
          </FlexContainer>
          <NavigationPanel />
        </FlexContainer>
      );

    case RouteLayoutType.SignFlow:
      return (
        <FlexContainer height="100vh" width="100%">
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
        </FlexContainer>
      );

    default:
      return (
        <FlexContainer height="100vh" width="100%">
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
