import styled from '@emotion/styled-base';
import React from 'react';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import AccStatusData from '../../constants/AccountStatusData';

interface Props {
  customRef: any;
  donePercent: number;
  onClick: () => void;
  activeStatus: AccountStatusEnum;
}

const AccountStatusBar = ({
  onClick,
  donePercent,
  activeStatus,
  customRef,
}: Props) => {
  return (
    <ButtonWithoutStyles onClick={onClick} ref={customRef}>
      <FlexContainer
        height="36px"
        alignItems="center"
        position="relative"
        padding="0 12px 0 0"
        zIndex="5"
      >
        <StatusLine
          donePercent={donePercent}
          color={AccStatusData[activeStatus].color}
          gradient={AccStatusData[activeStatus].gradient}
        />

        <StartWrapper>
          <StarIconComponent color={AccStatusData[activeStatus].color} />
        </StartWrapper>
      </FlexContainer>
    </ButtonWithoutStyles>
  );
};

export default AccountStatusBar;

const StartWrapper = styled(FlexContainer)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
`;

interface StatusLineProps {
  donePercent: number;
  color: string;
  gradient: string;
}

const StatusLine = styled(FlexContainer)<StatusLineProps>`
  width: 60px;
  height: 12px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 100px;
  position: relative;
  overflow: hidden;

  background: ${(props) =>
    props.gradient &&
    `linear-gradient(90deg, ${props.gradient} -0.6%, rgba(202, 226, 246, 0) 99.4%), rgba(0, 0, 0, 0.3);`};

  &:after {
    content: '';
    display: block;
    height: 100%;
    background: ${(props) => props.color};
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => `${props.donePercent || 3}%`};
  }
`;

interface StarIconComponentProps {
  color: string;
}
const StarIconComponent = ({ color }: StarIconComponentProps) => {
  return (
    <svg
      width="29"
      height="36"
      viewBox="0 0 29 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.00958 19.6808L10.3814 22.1822L9.87799 28.6727L9.6279 31.8973L11.6544 29.3766L27.0294 10.2516L25.7773 8.74377L16.9727 13.4664L17.7427 12.122L18.0503 11.5851L17.7071 11.0703L13.4571 4.6953L12.1023 2.66317L11.6429 5.06188L10.2424 12.3735L3.72219 17.9925L2.46613 19.0749L4.00958 19.6808ZM23.0613 17.8989L22.4576 16.2889L21.3568 17.6098L18.2318 21.3598L17.4644 22.2807L18.5079 22.8706L24.2579 26.1206L26.6519 27.4737L25.6863 24.8989L23.0613 17.8989Z"
        fill={color}
        stroke="#1C1F26"
        strokeWidth="2"
      />
    </svg>
  );
};
