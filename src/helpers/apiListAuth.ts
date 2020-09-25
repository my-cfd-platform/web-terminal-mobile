const AUTH_API_LIST = {
  TRADER: {
    REGISTER: '/auth/v1/Trader/Register',
    AUTHENTICATE: '/auth/v1/Trader/Authenticate',
    CHANGE_PASSWORD: '/auth/v1/Trader/ChangePassword',
    FORGOT_PASSWORD: '/auth/v1/Trader/ForgotPassword',
    PASSWORD_RECOVERY: '/auth/v1/Trader/PasswordRecovery',
    REFRESH_TOKEN: '/auth/v1/Trader/RefreshToken',
    LP_LOGIN: '/auth/v1/Trader/LpLogin',
    ADDITIONAL_REGISTRATION_FIELDS: '/auth/v1/Trader/AdditionalRegistrationFields',
  },
  PERSONAL_DATA: {
    CONFIRM: '/auth/v1/PersonalData/Confirm',
    GET: '/auth/v1/PersonalData',
    POST: '/auth/v1/PersonalData',
    ON_VERIFICATION: '/auth/v1/PersonalData/Kyc/OnVerification',
  },
  COMMON: {
    COUNTRIES: '/auth/v1/Common/Countries',
    SERVER_INFO: '/auth/v1/Common/ServerInfo',
    GEOLOCATION_INFO: '/auth/v1/Common/GeolocationInfo',
  },
  DOCUMENT: {
    POST: '/auth/v1/Documents/Identity',
  },
};

Object.freeze(AUTH_API_LIST);
export default AUTH_API_LIST;
