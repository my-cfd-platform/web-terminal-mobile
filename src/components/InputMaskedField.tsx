import React, { FC, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import Colors from '../constants/Colors';
import { FlexContainer } from '../styles/FlexContainer';
import ReactInputMask from 'react-input-mask';

interface InputFieldProps {
  id: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'datetime' | 'search';
  pattern?: string;
  name: string;
  hasError?: boolean;
  errorText?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  autoComplete?: string;
  inputMode?:
    | 'text'
    | 'email'
    | 'tel'
    | 'search'
    | 'none'
    | 'url'
    | 'numeric'
    | 'decimal'
    | undefined;
  onBeforeInput?: any;
  mask: string;
  readOnly?: boolean;
  className?: string;
}

const InputMaskedField: FC<InputFieldProps> = ({
  id,
  placeholder,
  type = 'text',
  pattern,
  onChange,
  onBlur,
  hasError = false,
  errorText = '',
  value,
  autoComplete,
  inputMode,
  onBeforeInput,
  mask,
  name,
  readOnly = false,
  className,
}) => {
  return (
    <InputWrap>
      <CustomInputMask
        mask={mask}
        maskPlaceholder={null}
        inputMode={inputMode}
        onBeforeInput={onBeforeInput}
        value={value}
        id={id}
        placeholder={placeholder}
        type={type}
        pattern={pattern}
        name={name}
        onChange={onChange}
        borderColor={(hasError && Colors.RED) || ''}
        onBlur={onBlur}
        autoComplete={autoComplete}
        readOnly={readOnly}
        className={className}
      />
      {hasError && <ErrorText>{errorText}</ErrorText>}
    </InputWrap>
  );
};

export default InputMaskedField;

const InputWrap = styled(FlexContainer)`
  width: 100%;
  flex-direction: column;
`;

const ErrorText = styled(FlexContainer)`
  color: ${Colors.RED};
  font-size: 11px;
  padding: 8px 16px 14px;
  line-height: 1.4;
`;

interface InputMaskProps {
  height?: string;
  padding?: string;
  fontSize?: string;
  borderColor?: string;
  maskPlaceholder?: string | null;
}

const CustomInputMask = styled(ReactInputMask, {
  shouldForwardProp: (propName: string) =>
    !['hasError', 'maskChar', 'borderColor'].includes(propName),
})<InputMaskProps>`
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
    box-shadow: 0 0 0px 1000px #1d2026 inset !important;
    -webkit-box-shadow: 0 0 0px 1000px #1d2026 inset !important;
    transition: background-color 5000s linear 0s !important;
    background-clip: content-box !important;
  }
`;
