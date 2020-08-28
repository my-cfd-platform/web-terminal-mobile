import React from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from '../components/SvgIcon';

import IconArea from '../assets/svg/chart-types/icon-area.svg';
import IconLine from '../assets/svg/chart-types/icon-line.png';
import IconCandle from '../assets/svg/chart-types/icon-candle.svg';
import Colors from '../constants/Colors';
const ChartSetting = () => {
  return (
    <BackFlowLayout pageTitle="Chart Settings">
      <FlexContainer flexDirection="column" padding="0 16px">
        <FlexContainer marginBottom="16px">
          <PrimaryTextSpan
            fontSize="13px"
            color="rgba(255, 255, 255, 0.4)"
            textTransform="uppercase"
          >
            Chart type
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer marginBottom="40px">
          <TypeButton onClick={() => {}} isActive={false}>
            <img src={IconLine} alt="" />
          </TypeButton>
          <TypeButton onClick={() => {}} isActive={false}>
            <SvgIcon {...IconCandle} />
          </TypeButton>
          <TypeButton onClick={() => {}} isActive={true}>
            <SvgIcon {...IconArea} />
          </TypeButton>
        </FlexContainer>

        <FlexContainer marginBottom="16px">
          <PrimaryTextSpan
            fontSize="13px"
            color="rgba(255, 255, 255, 0.4)"
            textTransform="uppercase"
          >
            Time frame
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer marginBottom="40px">
          <TimeFrameButton onClick={() => {}} isActive={true}>
            1m
          </TimeFrameButton>

          <TimeFrameButton onClick={() => {}} isActive={false}>
            5m
          </TimeFrameButton>

          <TimeFrameButton onClick={() => {}} isActive={false}>
            30m
          </TimeFrameButton>
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
};

export default ChartSetting;

const TypeButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  width: 64px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.isActive ? Colors.ACCENT : 'rgba(196, 196, 196, 0.5)'};
  border-radius: 4px;
  transition: all 0.4s ease;
  &:not(:last-of-type) {
    margin-right: 8px;
  }
`;


const TimeFrameButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  font-size: 16px;
  color: ${(props) => props.isActive ? Colors.ACCENT : 'rgba(196, 196, 196, 0.5)'};

  &:not(:last-of-type) {
    margin-right: 24px;
  }
`;