interface AccountStatusTableTooltipProps {
  id: string;
  label: string;
  tooltipText: string;
  blockWidth: string;
}

export const AccountStatusTableTooltip: AccountStatusTableTooltipProps[]  = [
  {
    id: "deposit",
    label: "Deposit",
    tooltipText: "test deposit",
    blockWidth: "144px"
  },
  {
    id: "instruments",
    label: "Instruments",
    tooltipText: "test",
    blockWidth: "144px"
  },
  {
    id: "personal_session",
    label: "Personal session",
    tooltipText: "test",
    blockWidth: "172px"
  },
  {
    id: "webinars",
    label: "Webinars",
    tooltipText: "test",
    blockWidth: "144px"
  },
  {
    id: "analytics",
    label: "Analytics",
    tooltipText: "test",
    blockWidth: "144px"
  },
  {
    id: "spread",
    label: "Spread",
    tooltipText: "test",
    blockWidth: "100px"
  },
  {
    id: "swap",
    label: "Swap",
    tooltipText: "test",
    blockWidth: "100px"
  },
];
