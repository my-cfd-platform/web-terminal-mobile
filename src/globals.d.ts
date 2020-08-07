declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.ico' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

declare module '*.woff' {
  const value: any;
  export default value;
}

declare module '*.woff2' {
  const value: any;
  export default value;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare const WS_HOST: string;
declare const API_STRING: string;
declare const API_DEPOSIT_STRING: string;
declare const API_WITHDRAWAL_STRING: string;
declare const API_AUTH_STRING: string;
declare const AUTH_TOKEN: string;
declare const CHARTING_LIBRARY_PATH: string;
declare const IS_LIVE: string;
declare const MIXPANEL_TOKEN: string;
declare const RECAPTCHA_KEY: string;
declare const BUILD_VERSION: string;
declare const grecaptcha: any;
declare const IS_LOCAL: boolean;

declare module 'global';
declare module 'react-qr-code';
