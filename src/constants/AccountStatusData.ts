import {
  AccountStatusEnum,
  AccStautsFeatureIconEnum,
} from '../enums/AccountStatusEnum';

interface IListElemet {
  icon: AccStautsFeatureIconEnum;
  label: string;
}

interface IDescriptionStatus {
  deposit: string;
  instruments: string;
  personal_session: string;
  webinars: string;
  analystics: string;
  spread: string;
  swap: string;
}

interface IOpenedFeatures {
  label: string;
  icon: AccStautsFeatureIconEnum;
  isNew: boolean;
}

export interface AccountStatusInfo {
  name: string;
  depositValue: string;
  color: string;
  gradient: string;
  newFeatures: IListElemet[] | null;
  description: IDescriptionStatus;
  openedFeatures: IOpenedFeatures[];
}

type IData = {
  [key in AccountStatusEnum]: AccountStatusInfo;
};

const AccStatusData: IData = {
  [AccountStatusEnum.BASIC]: {
    name: 'Basic',
    depositValue: '',
    color: '#FFFFFF',
    gradient: 'rgba(202, 226, 246, 0.2)',
    newFeatures: [],
    description: {
      deposit: 'from $50',
      instruments: '7 instruments',
      personal_session: 'Education course',
      webinars: 'No',
      analystics: 'No',
      spread: 'No',
      swap: 'No',
    },
    openedFeatures: [],
  },
  [AccountStatusEnum.SILVER]: {
    name: 'Silver',
    depositValue: '$250',
    color: '#CAE2F6',
    gradient: 'rgba(202, 226, 246, 0.2)',

    newFeatures: [
      {
        icon: AccStautsFeatureIconEnum.STAR,
        label: 'New Silver Status',
      },
      {
        icon: AccStautsFeatureIconEnum.CANDLES,
        label: 'Unlock 150+ Instruments',
      },
      {
        icon: AccStautsFeatureIconEnum.EDUCATION,
        label: 'Personal Account Management',
      },
      {
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        label: 'Basic Trading Conditions',
      },
    ],

    description: {
      deposit: 'from $250',
      instruments: '150+ Instruments',
      personal_session: 'Introductory session',
      webinars: 'No',
      analystics: 'Basic indicators',
      spread: 'No',
      swap: 'No',
    },

    openedFeatures: [
      {
        label: '150+ Instruments',
        icon: AccStautsFeatureIconEnum.CANDLES,
        isNew: true,
      },
      {
        label: 'Introductory Session',
        icon: AccStautsFeatureIconEnum.EDUCATION,
        isNew: true,
      },
      {
        label: 'Basic Trading Conditions',
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        isNew: true,
      },
    ],
  },
  [AccountStatusEnum.GOLD]: {
    name: 'Gold',
    depositValue: '$2,250',
    color: '#FFFCCC',
    gradient: 'rgba(255, 252, 204, 0.2)',

    newFeatures: [
      {
        icon: AccStautsFeatureIconEnum.STAR,
        label: 'New Gold Status',
      },
      {
        icon: AccStautsFeatureIconEnum.EDUCATION,
        label: 'Education course',
      },
      {
        icon: AccStautsFeatureIconEnum.VIDEO,
        label: 'Live Webinar',
      },
      {
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        label: 'Advanced Analytics Tools',
      },
      {
        icon: AccStautsFeatureIconEnum.SPREAD,
        label: 'Spread -20%',
      },
    ],

    description: {
      deposit: 'from $2,500',
      instruments: '150+ Instruments',
      personal_session: 'Education course',
      webinars: 'Live Webinar',
      analystics: 'Advance tools',
      spread: '-20%',
      swap: 'No',
    },

    openedFeatures: [
      {
        label: '150+ Instruments',
        icon: AccStautsFeatureIconEnum.CANDLES,
        isNew: true,
      },
      {
        label: 'Education course',
        icon: AccStautsFeatureIconEnum.CANDLES,
        isNew: true,
      },
      {
        label: 'Live Webinar',
        icon: AccStautsFeatureIconEnum.VIDEO,
        isNew: true,
      },
      {
        label: 'Advanced Analytics Tools',
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        isNew: true,
      },
      {
        label: 'Spread -20%',
        icon: AccStautsFeatureIconEnum.SPREAD,
        isNew: true,
      },
    ],
  },

  [AccountStatusEnum.PLATINUM]: {
    name: 'Platinum',
    depositValue: '$7,500',
    color: '#00FFDD',
    gradient: 'rgba(0, 255, 221, 0.2)',

    newFeatures: [
      {
        icon: AccStautsFeatureIconEnum.STAR,
        label: 'New Platinum Status',
      },
      {
        icon: AccStautsFeatureIconEnum.EDUCATION,
        label: 'Advanced Education',
      },
      {
        icon: AccStautsFeatureIconEnum.VIDEO,
        label: 'Weekly Webinars',
      },
      {
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        label: 'Custom Analytics',
      },
      {
        icon: AccStautsFeatureIconEnum.SPREAD,
        label: 'Spread -30%',
      },
      {
        icon: AccStautsFeatureIconEnum.SWAP,
        label: 'Swap -30%',
      },
    ],

    description: {
      deposit: 'from $10,000',
      instruments: '150+ Instruments',
      personal_session: 'Advanced Education',
      webinars: 'Weekly Webinars',
      analystics: 'Custom Analytics',
      spread: '-30%',
      swap: '-30%',
    },

    openedFeatures: [
      {
        label: '150+ Instruments',
        icon: AccStautsFeatureIconEnum.CANDLES,
        isNew: false,
      },
      {
        label: 'Advanced Education',
        icon: AccStautsFeatureIconEnum.EDUCATION,
        isNew: true,
      },
      {
        label: 'Weekly Webinar',
        icon: AccStautsFeatureIconEnum.VIDEO,
        isNew: true,
      },
      {
        label: 'Custom Analytics',
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        isNew: true,
      },
      {
        label: 'Spread -30%',
        icon: AccStautsFeatureIconEnum.SPREAD,
        isNew: true,
      },
      {
        label: 'Swap -30%',
        icon: AccStautsFeatureIconEnum.SWAP,
        isNew: true,
      },
    ],
  },
  [AccountStatusEnum.DIAMOND]: {
    name: 'Diamond',
    depositValue: '$15,000',
    color: '#4BC5FF',
    gradient: 'rgba(75, 197, 255, 0.2)',

    newFeatures: [
      {
        icon: AccStautsFeatureIconEnum.STAR,
        label: 'New Diamond Status',
      },
      {
        icon: AccStautsFeatureIconEnum.EDUCATION,
        label: 'Tutorials at Request',
      },
      {
        icon: AccStautsFeatureIconEnum.VIDEO,
        label: 'All Webinars',
      },
      {
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        label: 'TOP Analytics',
      },
      {
        icon: AccStautsFeatureIconEnum.SPREAD,
        label: 'Spread -50%',
      },
      {
        icon: AccStautsFeatureIconEnum.SWAP,
        label: 'Swap -50%',
      },
    ],

    description: {
      deposit: 'from $25,000',
      instruments: '150+ Instruments',
      personal_session: 'Tutorials at request',
      webinars: 'All Webinars',
      analystics: 'TOP Analytics',
      spread: '-50%',
      swap: '-50%',
    },

    openedFeatures: [
      {
        label: '150+ Instruments',
        icon: AccStautsFeatureIconEnum.CANDLES,
        isNew: false,
      },
      {
        label: 'Tutorials at Request',
        icon: AccStautsFeatureIconEnum.EDUCATION,
        isNew: true,
      },
      {
        label: 'All Webinars',
        icon: AccStautsFeatureIconEnum.VIDEO,
        isNew: true,
      },
      {
        label: 'TOP Analytics',
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        isNew: true,
      },
      {
        label: 'Spread -50%',
        icon: AccStautsFeatureIconEnum.SPREAD,
        isNew: true,
      },
      {
        label: 'Swap -50%',
        icon: AccStautsFeatureIconEnum.SWAP,
        isNew: true,
      },
    ],
  },
  [AccountStatusEnum.VIP]: {
    name: 'VIP',
    depositValue: '$50,000',
    color: '#B18CFF',
    gradient: 'rgba(177, 140, 255, 0.2)',

    newFeatures: [
      {
        icon: AccStautsFeatureIconEnum.STAR,
        label: 'New VIP Status',
      },
      {
        icon: AccStautsFeatureIconEnum.EDUCATION,
        label: 'Personal trading assistance',
      },
      {
        icon: AccStautsFeatureIconEnum.VIDEO,
        label: 'All Webinars',
      },
      {
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        label: 'TOP Analytics',
      },
      {
        icon: AccStautsFeatureIconEnum.SPREAD,
        label: 'Spread -70%',
      },
      {
        icon: AccStautsFeatureIconEnum.SWAP,
        label: 'Swap -70%',
      },
    ],

    description: {
      deposit: 'from $75,000',
      instruments: '150+ Instruments',
      personal_session: 'Personal trading assistance',
      webinars: 'All Webinars',
      analystics: 'TOP Analytics',
      spread: '-70%',
      swap: '-70%',
    },

    openedFeatures: [
      {
        label: '150+ Instruments',
        icon: AccStautsFeatureIconEnum.CANDLES,
        isNew: false,
      },
      {
        label: 'Personal trading assistance',
        icon: AccStautsFeatureIconEnum.EDUCATION,
        isNew: true,
      },
      {
        label: 'All Webinars',
        icon: AccStautsFeatureIconEnum.VIDEO,
        isNew: false,
      },
      {
        label: 'TOP Analytics',
        icon: AccStautsFeatureIconEnum.DIAGRAM,
        isNew: false,
      },
      {
        label: 'Spread -70%',
        icon: AccStautsFeatureIconEnum.SPREAD,
        isNew: true,
      },
      {
        label: 'Swap -70%',
        icon: AccStautsFeatureIconEnum.SWAP,
        isNew: true,
      },
    ],
  },
};

Object.freeze(AccStatusData);

export default AccStatusData;
