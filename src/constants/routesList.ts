import Page from './Pages';
import Dashboard from '../pages/Dashboard';
import SignUp from '../pages/SignUp';
import SingIn from '../pages/SignIn';
import ForgotPassword from '../pages/ForgotPassword';
import Markets from '../pages/Markets';
import AccountsPage from '../pages/AccountsPage';
import Portfolio from '../pages/Portfolio';
import PositionDetails from '../pages/PositionDetails';
import AccountProfile from '../pages/AccountProfile';
import News from '../pages/News';
import ChartSetting from '../pages/ChartSetting';
import OrderPage from '../pages/OrderPage';
import AccountBalanceHistory from '../pages/AccountBalanceHistory';
import AccountWithdraw from '../pages/AccountWithdraw';
import AccountAboutUs from '../pages/AccountAboutUs';
import RecoveryPassword from '../pages/RecoveryPassword';
import LpLogin from '../pages/LpLogin';
import ConfirmEmail from '../pages/ConfirmEmail';

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
    layoutType: RouteLayoutType.SignFlow,
  },
  {
    component: ForgotPassword,
    path: Page.FORGOT_PASSWORD,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },


  {
    component: RecoveryPassword,
    path: Page.RESET_PASSWORD,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },

  {
    component: ConfirmEmail,
    path: Page.EMAIL_CONFIRMATION,
    exact: false,
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
  
  {
    component: AccountBalanceHistory,
    path: Page.ACCOUNT_BALANCE_HISTORY,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: AccountWithdraw,
    path: Page.ACCOUNT_WITHDRAW,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: AccountAboutUs,
    path: Page.ACCOUNT_ABOUT_US,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: LpLogin,
    path: Page.LP_LOGIN,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
];

export default routesList;
