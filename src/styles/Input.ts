import styled from '@emotion/styled';
import Colors from '../constants/Colors';

export interface InputProps {
  height?: string;
  padding?: string;
  fontSize?: string;
  borderColor?: string;
}

export const Input = styled.input<InputProps>`
  width: 100%;
  border: none;
  height: ${(props) => props.height || '50px'};
  padding: ${(props) => props.padding || '14px 16px 14px'};
  font-size: ${(props) => props.fontSize || '16px'};
  border-bottom: ${(props) =>
    `${props.borderColor || Colors.DARK_BLACK} 2px solid`};

  background-color: ${Colors.INPUT_BG};
  color: ${Colors.ACCENT};

  font-style: normal;
  font-weight: normal;
  box-shadow: none;
  appearance: none;
  outline: none;

  transition: all 0.4s ease;
  &:focus {
    background-color: ${Colors.INPUT_FOCUS_BG};
  }
  &::placeholder {
    color: ${Colors.INPUT_LABEL_TEXT};
  }
  &:active,
  &:focus {
    outline: none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:valid,
  &:-webkit-autofill:active {
    font-size: ${(props) => props.fontSize || '16px'} !important;
    -webkit-text-fill-color: #fffccc !important;
    transition: background-color 5000s linear 0s !important;
  }
`;
