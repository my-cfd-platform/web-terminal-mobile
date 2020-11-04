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
import WithdrawList from '../pages/WithdrawList';
import AccountLanguage from '../pages/AccountLanguage';
import AccountVerification from '../pages/AccountVerification';
import AccountAboutUs from '../pages/AccountAboutUs';
import RecoveryPassword from '../pages/RecoveryPassword';
import PhoneVerification from '../pages/PhoneVerification';
import LpLogin from '../pages/LpLogin';
import ConfirmEmail from '../pages/ConfirmEmail';
import WithdrawalHistory from '../pages/WithdrawHistory';
import WithdrawVisaMasterForm from '../pages/WithdrawVisaMasterForm';
import WithdrawBitcoinForm from '../pages/WithdrawBitcoinForm';
import WithdrawalHistoryDetails from '../pages/WithdrawalHistoryDetails';

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
    component: WithdrawList,
    path: Page.WITHDRAW_LIST,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: WithdrawalHistory,
    path: Page.WITHDRAW_HISTORY,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: WithdrawVisaMasterForm,
    path: Page.WITHDRAW_VISAMASTER,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: WithdrawBitcoinForm,
    path: Page.WITHDRAW_BITCOIN,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: WithdrawalHistoryDetails,
    path: Page.WITHDRAW_HISTORY_ID,
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
    component: AccountLanguage,
    path: Page.ACCOUNT_CHANGE_LANGUAGE,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: AccountVerification,
    path: Page.ACCOUNT_VERIFICATION,
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
  {
    component: PhoneVerification,
    path: Page.PHONE_VERIFICATION,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
];

export default routesList;
