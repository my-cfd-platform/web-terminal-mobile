import styled from '@emotion/styled';
import { ButtonWithoutStyles } from './ButtonWithoutStyles';
import Colors from '../constants/Colors';

interface PrimaryButtonProps {
  padding?: string;
  backgroundColor?: string;
  width?: string;
  isBorder?: boolean;
  height?: string;
}

interface SecondaryButtonProps {
  padding?: string;
  backgroundColor?: string;
  width?: string;
}

export const PrimaryButton = styled(ButtonWithoutStyles)<PrimaryButtonProps>`
  padding: ${(props) => props.padding || '4px 8px'};
  width: ${(props) => props.width};
  height: ${(props) => props.height || '56px'};
  background-color: ${(props) =>
    props.isBorder
      ? 'transparent'
      : props.backgroundColor || Colors.ACCENT_BLUE};
  border: ${(props) => props.isBorder && '2px solid #FFFFFF'};
  border-radius: 12px;
  transition: background-color 0.2s ease;
  font-weight: 600;

  &:hover {
    background-color: ${(props) => !props.isBorder && '#9ffff2'};
  }

  &:focus {
    background-color: ${(props) => !props.isBorder && '#21b3a4'};
  }

  &:disabled {
    background-color: ${Colors.DISSABLED};
    color: #252636;
  }
`;

export const SecondaryButton = styled(ButtonWithoutStyles)<
  SecondaryButtonProps
>`
  width: ${(props) => props.width};
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  height: 56px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }

  &:focus {
    background-color: rgba(0, 0, 0, 0.24);
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    & span {
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;



export const TradeButton = styled(ButtonWithoutStyles)`
  background-color: #00ffdd;
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #252636;
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
    color: #252636;
  }
`;