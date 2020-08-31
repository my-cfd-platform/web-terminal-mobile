import React, { ChangeEvent, FC } from 'react';
import { Input } from '../styles/Input';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';
import Colors from '../constants/Colors';

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
}

const InputField: FC<InputFieldProps> = ({
  id,
  placeholder,
  type = 'text',
  pattern,
  onChange,
  onBlur,
  hasError = false,
  errorText = '',
  value,
}) => {
  console.log(hasError, errorText);
  return (
    <InputWrap>
      <CustomInput
        value={value}
        id={id}
        placeholder={placeholder}
        type={type}
        pattern={pattern}
        name={name}
        onChange={onChange}
        borderColor={(hasError && Colors.RED) || ''}
        onBlur={onBlur}
      />
      {hasError && <ErrorText>{errorText}</ErrorText>}
    </InputWrap>
  );
};

export default InputField;

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

const CustomInput = styled(Input)``;
