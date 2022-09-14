export enum BrandEnum {
  AM = 'allianzmarket',
  Monfex = 'monfex',
  HP = 'handelpro',
  WT = 'welltrade',
}

export const brandingLinksTranslate = {
  [BrandEnum.AM]: {
    faq: 'FAQ_AM',
    termsCondition: 'TermsConditions_AM',
    privacyPolicy: 'PrivacyPolicy_AM',
    aboutUs: 'AboutUs_AM',
    support: 'Support_AM',
  },
  [BrandEnum.HP]: {
    faq: 'FAQ_HP',
    termsCondition: 'TermsConditions_HP',
    privacyPolicy: 'PrivacyPolicy_HP',
    aboutUs: 'AboutUs_HP',
    support: 'Support_HP',
  },
  [BrandEnum.Monfex]: {
    faq: 'FAQ_M',
    termsCondition: 'TermsConditions_M',
    privacyPolicy: 'PrivacyPolicy_M',
    aboutUs: 'AboutUs_M',
    support: 'Support_M',
  },
  [BrandEnum.WT]: {
    faq: '',
    termsCondition: '',
    privacyPolicy: '',
    aboutUs: '',
    support: '',
  },
};
