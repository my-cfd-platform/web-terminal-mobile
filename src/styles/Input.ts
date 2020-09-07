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
  height: ${props => props?.height || "50px"};
  padding: ${props => props?.padding || "14px 16px 14px"};
  font-size: ${props => props?.fontSize || "16px"};
  border-bottom: ${props => `${props.borderColor || Colors.DARK_BLACK} 2px solid`};

  background-color: ${Colors.INPUT_BG};
  color: ${Colors.ACCENT};

  font-style: normal;
  font-weight: normal;
  box-shadow: none;
  appearance: none;
  outline: none;
  
  transition: all .4s ease;
  &:focus {
    background-color: ${Colors.INPUT_FOCUS_BG};
  }
  &::placeholder {
    color: ${Colors.INPUT_LABEL_TEXT};
  }
  &:active, &:focus {
    outline: none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:valid,
  &:-webkit-autofill:active {
    transition: border 0.2s ease, background-color 50000s ease-in-out 0s;
    -webkit-text-fill-color: #fffccc !important;
    font-size: ${props => props?.fontSize || "16px"};
    -webkit-box-shadow: inset 0 0 0px 9999px ${Colors.INPUT_BG};
  }
`;