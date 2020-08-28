import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconArea from '../../assets/svg/icon-chart-area.svg';
import TimeScalePanel from './TimeScalePanel';
import { Link } from 'react-router-dom';
import Page from '../../constants/Pages';

const TimeScaleWrapper = () => {
  return (
    <FlexContainer
      justifyContent="space-between"
      padding="8px 16px"
      marginBottom="12px"
    >
      <FlexContainer>
        <Link to={Page.CHART_SETTING}>
        <SvgIcon
          {...IconArea}
          width={16}
          height={16}
          fillColor="rgba(196, 196, 196, 0.5)"
        /></Link>
      </FlexContainer>
      <TimeScalePanel></TimeScalePanel>
    </FlexContainer>
  );
};

export default TimeScaleWrapper;
