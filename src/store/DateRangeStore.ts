import { observable, action } from 'mobx';
import moment from 'moment';
import { FocusedInputShape } from 'react-dates';
import { ShowDatesDropdownEnum } from '../enums/ShowDatesDropdownEnum';

interface ContextProps {
  openedDropdown: boolean;
  dropdownValueType: ShowDatesDropdownEnum;
  startDate: moment.Moment;
  endDate: moment.Moment;
  focusedInput: FocusedInputShape | null;
}

export class DateRangeStore implements ContextProps {
  @observable openedDropdown = false;
  @observable dropdownValueType: ShowDatesDropdownEnum =
    ShowDatesDropdownEnum.Week;
  @observable startDate: moment.Moment = moment().subtract(1, 'w');
  @observable endDate: moment.Moment = moment();
  @observable focusedInput: FocusedInputShape | null = null;

  @action
  closeDropdown = () => {
    this.focusedInput = null;
    this.openedDropdown = false;
  };

  @action
  openDropdown = () => {
    this.openedDropdown = true;
  };

  @action
  openDatepicker = () => {
    this.focusedInput = 'startDate';
  };

  @action
  closeDatepicker = () => {
    this.focusedInput = null;
  };

  @action
  toggleDatepicker = () => {
    this.focusedInput = this.focusedInput ? null : 'startDate';
  };

  @action
  resetDatepicker = () => {
    this.startDate = moment().subtract(1, 'w');
    this.endDate = moment();
    this.focusedInput = null;
    this.dropdownValueType = ShowDatesDropdownEnum.Week;
  };
}
