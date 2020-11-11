import { action, observable } from 'mobx';
import { PortfolioTabEnum } from '../enums/PortfolioTabEnum';

interface Props {
  currentPortfolioNav: PortfolioTabEnum;
}

export class PortfolioNavLinksStore implements Props {
  @observable currentPortfolioNav: PortfolioTabEnum = PortfolioTabEnum.ACTIVE;

  @action
  setPortfolioNavLink = (newNavLink: PortfolioTabEnum) => {
    this.currentPortfolioNav = newNavLink;
  };
}
