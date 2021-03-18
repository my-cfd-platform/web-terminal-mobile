
export enum BrandEnum {
	AM = "allianzmarket",
	Monfex = "monfex",
	HP = "handelpro"
}

export const brandingLinksTranslate = {
	[BrandEnum.AM]: {
		faq: "FAQ_AM",
		termsCondition: "TermsConditions_AM",
		privacyPolicy: "PrivacyPolicy_AM"
	},
	[BrandEnum.HP]: {
		faq: "FAQ_HP",
		termsCondition: "TermsConditions_HP",
		privacyPolicy: "PrivacyPolicy_HP"
	},
	[BrandEnum.Monfex]: {
		faq: "FAQ_M",
		termsCondition: "TermsConditions_M",
		privacyPolicy: "PrivacyPolicy_M"
	}
}