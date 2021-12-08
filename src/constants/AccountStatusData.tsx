import { AccountStatusEnum } from '../enums/AccountStatusEnum';

import IconStar from '../assets/svg_no_compress/account-status/icons-content/icon-start.svg';
import IconCandles from '../assets/svg_no_compress/account-status/icons-content/icon-candles.svg';
import IconEducation from '../assets/svg_no_compress/account-status/icons-content/icon-education.svg';
import IconDiagram from '../assets/svg_no_compress/account-status/icons-content/icon-diagram.svg';
import IconVideo from '../assets/svg_no_compress/account-status/icons-content/icon-youtube.svg';
import IconSpread from '../assets/svg_no_compress/account-status/icons-content/icon-tag.svg';
import IconSwap from '../assets/svg_no_compress/account-status/icons-content/icon-swap.svg';

const AccStatusData = {
  [AccountStatusEnum.BASIC]: {
    name: 'Basic',
    depositValue: '',
    color: '#FFFFFF',
    gradient: 'rgba(202, 226, 246, 0.2)',
    newFeatures: [],
  },
  [AccountStatusEnum.SILVER]: {
    name: 'Silver',
    depositValue: '$250',
    color: '#CAE2F6',
    gradient: 'rgba(202, 226, 246, 0.2)',

    newFeatures: [
      {
        icon: IconStar,
        label: 'New Silver Status',
      },
      {
        icon: IconCandles,
        label: 'Unlock 150+ Instruments',
      },
      {
        icon: IconEducation,
        label: 'Personal Account Management',
      },
      {
        icon: IconDiagram,
        label: 'Basic Trading Conditions',
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
        icon: IconStar,
        label: 'New Gold Status',
      },
      {
        icon: IconEducation,
        label: 'Education Course',
      },
      {
        icon: IconVideo,
        label: 'Live Webinar',
      },
      {
        icon: IconDiagram,
        label: 'Advanced Analytics Tools',
      },
      {
        icon: IconSpread,
        label: 'Spread -20%',
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
        icon: IconStar,
        label: 'New Platinum Status',
      },
      {
        icon: IconEducation,
        label: 'Advanced Education',
      },
      {
        icon: IconVideo,
        label: 'Weekly Webinars',
      },
      {
        icon: IconDiagram,
        label: 'Custom Analytics',
      },
      {
        icon: IconSpread,
        label: 'Spread -30%',
      },
      {
        icon: IconSwap,
        label: 'Swap -30%',
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
        icon: IconStar,
        label: 'New Diamond Status',
      },
      {
        icon: IconEducation,
        label: 'Tutorials at Request',
      },
      {
        icon: IconVideo,
        label: 'All Webinars',
      },
      {
        icon: IconDiagram,
        label: 'TOP Analytics',
      },
      {
        icon: IconSpread,
        label: 'Spread -50%',
      },
      {
        icon: IconSwap,
        label: 'Swap -50%',
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
        icon: IconStar,
        label: 'New VIP Status',
      },
      {
        icon: IconEducation,
        label: 'Personal trading assistance',
      },
      {
        icon: IconVideo,
        label: 'All Webinars',
      },
      {
        icon: IconDiagram,
        label: 'TOP Analytics',
      },
      {
        icon: IconSpread,
        label: 'Spread -70%',
      },
      {
        icon: IconSwap,
        label: 'Swap -70%',
      },
    ],
  },
};

Object.freeze(AccStatusData);

export default AccStatusData;
