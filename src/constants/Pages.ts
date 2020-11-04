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
  ACCOUNT_WITHDRAW_NEW: '/account-withdraw-new-all',
  ACCOUNT_WITHDRAW_NEW_BANKTRANSFER: '/account-withdraw/new/banktransfer',
  ACCOUNT_WITHDRAW_NEW_SUCCESS: '/account-withdraw/new/success',
  ACCOUNT_WITHDRAW_NEW_BITCOIN: '/account-withdraw/new/bitcoin',
  ACCOUNT_WITHDRAW_HISTORY: '/account-withdraw-history-all',
  ACCOUNT_BALANCE_HISTORY: '/account-balance-history',
  ACCOUNT_SETTINGS: '/account-settings',
  ACCOUNT_SEQURITY: '/account-security',
  ACCOUNT_HISTORY_QUOTES: '/account-history-quotes',
  ACCOUNT_ABOUT_US: '/account-about-us',
  ACCOUNT_CHANGE_LANGUAGE: '/account-change-language',
  ACCOUNT_VERIFICATION: '/account-verification',
  PAYMENTS: '/payments/:status',

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

  ACCOUNTS_SWITCH: '/accounts',
  DEPOSIT: '/deposit',
  CHART_SETTING: '/chart-setting',

  ORDER_MAIN: '/order',
  ORDER: '/order/:type/:id',

};

Object.freeze(Page);

export default Page;
