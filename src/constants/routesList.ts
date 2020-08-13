import Page from './Pages';
import Dashboard from '../pages/Dashboard';
import SignUp from '../pages/SignUp';
import SingIn from '../pages/SignIn';
import ForgotPassword from '../pages/ForgotPassword';
import Markets from '../pages/Markets';



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
  // {
  //   component: LpLogin,
  //   path: Page.LP_LOGIN,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.Public,
  // },
  {
    component: SignUp,
    path: Page.SIGN_UP,
    exact: true,
    strict: true,
    layoutType: RouteLayoutType.Public,
  },
  // {
  //   component: EmailConfirmation,
  //   path: Page.EMAIL_CONFIRMATION,
  //   exact: false,
  //   strict: true,
  //   layoutType: RouteLayoutType.Public,
  // },
   {
     component: ForgotPassword,
     path: Page.FORGOT_PASSWORD,
     exact: true,
     strict: true,
     layoutType: RouteLayoutType.Public,
   },
  // {
  //   component: ResetPassword,
  //   path: Page.RESET_PASSWORD,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.Public,
  // },
   {
     component: Dashboard,
     path: Page.DASHBOARD,
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
  // {
  //   component: AccountBalance,
  //   path: Page.ACCOUNT_BALANCE_HISTORY,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.Authorized,
  // },
  // {
  //   component: AccountSecurity,
  //   path: Page.ACCOUNT_SEQURITY,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.Authorized
  // },
  // {
  //   component: Withdraw,
  //   path: Page.ACCOUNT_WITHDRAW,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.Authorized
  // },
  // {
  //   component: PersonalData,
  //   path: Page.PERSONAL_DATA,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.KYC,
  // },  {
  //   component: PhoneVerification,
  //   path: Page.PHONE_VERIFICATION,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.KYC,
  // },  {
  //   component: ProofOfIdentity,
  //   path: Page.PROOF_OF_IDENTITY,
  //   exact: true,
  //   strict: true,
  //   layoutType: RouteLayoutType.KYC,
  // },
];

export default routesList;
