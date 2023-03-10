const Page = {
  DASHBOARD: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  LP_LOGIN: '/lpLogin/:token',
  EMAIL_CONFIRMATION: '/confirm/:id',
  FORGOT_PASSWORD: '/reset-password',
  RESET_PASSWORD: '/recovery/:token',
  PERSONAL_DATA: '/personal-data',
  PHONE_VERIFICATION: '/phone-verification',
  PROOF_OF_IDENTITY: '/proof-of-identity',
  ACCOUNT_PROFILE: '/account-profile',
  ACCOUNT_DEPOSIT: '/account-deposit',
  WITHDRAW_LIST: '/withdraw-list',
  WITHDRAW_VISAMASTER: '/withdraw-banktransfer',
  WITHDRAW_SUCCESS: '/withdraw-success',
  WITHDRAW_BITCOIN: '/withdraw-bitcoin',
  WITHDRAW_HISTORY: '/withdraw-history',
  WITHDRAW_HISTORY_ID: '/withdraw-history/:id',
  ACCOUNT_BALANCE_HISTORY: '/account-balance-history',
  ACCOUNT_SETTINGS: '/account-settings',
  ACCOUNT_SEQURITY: '/account-security',
  ACCOUNT_HISTORY_QUOTES: '/account-history-quotes',
  ACCOUNT_ABOUT_US: '/account-about-us',
  ACCOUNT_CHANGE_LANGUAGE: '/account-change-language',
  ACCOUNT_CHANGE_PASSWORD: '/account-change-password',
  ACCOUNT_VERIFICATION: '/account-verification',
  VERIFICATION_SUCCESS_SEND: '/account-verification-sended',
  PAYMENTS: '/payments/:status',
  ONBOARDING: '/onboarding',
  BONUS_FAQ: '/bonus-faq',
  DEMO_REAL_PAGE: '/select-account',
  MT5_CHANGE_ACCOUNT: '/select-account-mt5',
  MT5_INFO_ACCOUNT: '/select-account-mt5-info',

  ABOUT_US: 'https://www.monfex.com/why-us',
  FAQ: '#',
  SUPPORT: 'https://www.monfex.com/contact-us',

  TERMS_OF_SERVICE: 'https://monfex.com/terms-of-service',
  PRIVACY_POLICY: 'https://www.monfex.com/privacy-policy',

  MARKETS: '/markets',
  PORTFOLIO: '/portfolio/:type',
  POSITION_DETAILS: '/portfolio/:type/:id',
  PORTFOLIO_MAIN: '/portfolio',
  NEWS: '/news',
  EDUCATION: '/course',
  EDUCATION_LIST: '/course/:id',
  EDUCATION_QUESTION: '/course/question',

  ACCOUNTS_SWITCH: '/accounts',
  DEPOSIT: '/deposit',
  CHART_SETTING: '/chart-setting',

  ORDER_MAIN: '/order',
  ORDER: '/order/:type/:id',

  SL_EDIT_MAIN: '/edit-sl',
  SL_EDIT: '/edit-sl/:id',

  TP_EDIT_MAIN: '/edit-tp',
  TP_EDIT: '/edit-tp/:id',

  SL_CREATE_MAIN: '/create-sl',

  TP_CREATE_MAIN: '/create-tp',

  ABOUT_STATUS: '/about-status',
  PAGE_NOT_FOUND: '/page-not-found',
};

Object.freeze(Page);

export default Page;
