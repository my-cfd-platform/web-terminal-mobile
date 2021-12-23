interface AccountStatusTableTooltipProps {
  id: string;
  label: string;
  tooltipText: string;
  blockWidth: string;
}

export const AccountStatusTableTooltip: AccountStatusTableTooltipProps[] = [
  {
    id: 'deposit',
    label: 'Deposit',
    tooltipText:
      'This is the amount of funds that will be available for you to trade with',
    blockWidth: '144px',
  },
  {
    id: 'instruments',
    label: 'Instruments',
    tooltipText: 'Number of Assets that can be traded',
    blockWidth: '144px',
  },
  {
    id: 'personal_session',
    label: 'Personal session',
    tooltipText:
      'Type of included personal educational session with an investment manager',
    blockWidth: '172px',
  },
  {
    id: 'webinars',
    label: 'Webinars',
    tooltipText:
      'Live sessions with a professional trader during market events or promotions',
    blockWidth: '144px',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    tooltipText:
      'Access to assisted trading software, indicators, analytics  and special charting tools',
    blockWidth: '144px',
  },
  {
    id: 'spread',
    label: 'Spread',
    tooltipText:
      'A discount on the commission that occurs from the difference between Bid and Ask prices',
    blockWidth: '100px',
  },
  {
    id: 'swap',
    label: 'Swap',
    tooltipText: 'A discount on the over-the-night transactions',
    blockWidth: '100px',
  },
];
