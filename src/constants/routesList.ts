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
import AccountChangePassword from '../pages/AccountChangePassword';
import AccountAboutUs from '../pages/AccountAboutUs';
import RecoveryPassword from '../pages/RecoveryPassword';
import PhoneVerification from '../pages/PhoneVerification';
import LpLogin from '../pages/LpLogin';
import ConfirmEmail from '../pages/ConfirmEmail';
import WithdrawalHistory from '../pages/WithdrawHistory';
import WithdrawVisaMasterForm from '../pages/WithdrawVisaMasterForm';
import WithdrawBitcoinForm from '../pages/WithdrawBitcoinForm';
import WithdrawalHistoryDetails from '../pages/WithdrawalHistoryDetails';
import WithdrawSuccessRequest from '../components/Withdraw/WithdrawSuccessRequest';
import PositionEditSL from '../pages/PositionEditSL';
import PositionEditTP from '../pages/PositionEditTP';
import Onboarding from '../pages/Onboarding';
import AccountBonusFaq from '../pages/AccountBonusFaq';
import DemoRealPage from '../pages/DemoRealPage';
import EducationCourse from '../pages/EducationCourse';
import EducationListPage from '../pages/EducationListPage';
import EducationQuestionPage from '../pages/EducationQuestionPage';
import PageNotFound from '../pages/PageNotFound';
import PositionCreateSL from '../pages/PositionCreateSL';
import PositionCreateTP from '../pages/PositionCreateTP';
import AboutStatusPage from '../pages/AboutStatusPage';
import AccountKYCSuccessPage from '../pages/AccountKYCSuccessPage';
// import AccountsMT5 from '../pages/AccountsMT5';
// import AccountMTLoginDetail from '../pages/AccountMTLoginDetail';
import DepositPage from '../pages/DepositPage';

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
    component: EducationCourse,
    path: Page.EDUCATION,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: EducationQuestionPage,
    path: Page.EDUCATION_QUESTION,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: EducationListPage,
    path: Page.EDUCATION_LIST,
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
    component: DemoRealPage,
    path: Page.DEMO_REAL_PAGE,
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
    component: WithdrawSuccessRequest,
    path: Page.WITHDRAW_SUCCESS,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: PositionEditSL,
    path: Page.SL_EDIT,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: PositionEditTP,
    path: Page.TP_EDIT,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: PositionCreateSL,
    path: Page.SL_CREATE_MAIN,
    exact: false,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: PositionCreateTP,
    path: Page.TP_CREATE_MAIN,
    exact: false,
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

  // {
  //   component: AccountsMT5,
  //   path: Page.MT5_CHANGE_ACCOUNT,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.Authorized,
  // },

  {
    component: DepositPage,
    path: Page.DEPOSIT,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  // {
  //   component:  AccountMTLoginDetail,
  //   path: Page.MT5_INFO_ACCOUNT,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.Authorized,
  // },

  {
    component: AccountBonusFaq,
    path: Page.BONUS_FAQ,
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
    component: AccountKYCSuccessPage,
    path: Page.VERIFICATION_SUCCESS_SEND,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: AccountChangePassword,
    path: Page.ACCOUNT_CHANGE_PASSWORD,
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
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: Onboarding,
    path: Page.ONBOARDING,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
  {
    component: PageNotFound,
    path: Page.PAGE_NOT_FOUND,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },

  {
    component: AboutStatusPage,
    path: Page.ABOUT_STATUS,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Authorized,
  },
];

export default routesList;
