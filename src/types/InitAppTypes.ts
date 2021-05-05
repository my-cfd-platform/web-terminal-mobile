import { BrandEnum } from './../constants/brandingLinksTranslate';
export interface InitModel {
  logo: string;
  tradingUrl: string;
  authUrl: string;
  miscUrl: string;
  policyUrl: string;
  termsUrl: string;
  faqUrl: string;
  withdrawFaqUrl: string;
  aboutUrl: string;
  supportUrl: string;
  androidAppLink: string;
  iosAppLink: string;
  brandName: string;
  brandCopyrights: string;
  brandProperty: BrandEnum;
  gaAsAccount: string;
  favicon: string;
  mixpanelToken: string;
  recaptchaToken: string;
  iosAppId: string;
  androidAppId: string;
  mobileAppLogo: string;
}
