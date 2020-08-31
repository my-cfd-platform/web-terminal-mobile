import Page from './Pages';
import Dashboard from '../pages/Dashboard';
import SignUp from '../pages/SignUp';
import SingIn from '../pages/SignIn';
import ForgotPassword from '../pages/ForgotPassword';
import Markets from '../pages/Markets';
import AccountsPage from "../pages/AccountsPage";
import Portfolio from "../pages/Portfolio";
import PositionDetails from "../pages/PositionDetails";
import AccountProfile from '../pages/AccountProfile';
import News from '../pages/News';
import ChartSetting from '../pages/ChartSetting';
import OrderPage from '../pages/OrderPage';

export enum RouteLayoutType {
  Authorized,
  SignFlow,
  Public,
  KYC,
  Page404,
}

const routesList = [
  {
    component: SingIn,
    path: Page.SIGN_IN,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.SignFlow,
  },
  {
    component: SignUp,
    path: Page.SIGN_UP,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
  {
    component: ForgotPassword,
    path: Page.FORGOT_PASSWORD,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
  {
    component: Dashboard,
    path: Page.DASHBOARD,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: ChartSetting,
    path: Page.CHART_SETTING,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: AccountsPage,
    path: Page.ACCOUNTS_SWITCH,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: Markets,
    path: Page.MARKETS,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: Portfolio,
    path: Page.PORTFOLIO_MAIN,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: PositionDetails,
    path: Page.POSITION_DETAILS,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: Portfolio,
    path: Page.PORTFOLIO,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: AccountProfile,
    path: Page.ACCOUNT_PROFILE,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: News,
    path: Page.NEWS,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: OrderPage,
    path: Page.ORDER,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
];

export default routesList;
