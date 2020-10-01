import React, { FC, ChangeEvent, useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import Colors from '../../constants/Colors';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import { FlexContainer } from '../../styles/FlexContainer';
import API from '../../helpers/API';
import { Country } from '../../types/CountriesTypes';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import IconArrowLink from '../../assets/svg/Profile/icon-arrow-link.svg';
import SvgIcon from '../SvgIcon';

interface Props {
  labelText: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  hasError?: boolean;
  autoComplete?: string;
  dropdownItemsList: Country[];
  setFieldValue: (arg0: string, arg1: string) => void;
  handleChange?: (arg0: Country) => void;
}

const AutoCompleteDropdown: FC<Props> = (props) => {
  const {
    labelText,
    id,
    name,
    onChange,
    value,
    hasError,
    autoComplete,
    dropdownItemsList,
    setFieldValue,
    handleChange,
  } = props;
  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mainAppStore } = useStores();

  const { t } = useTranslation();

  const toggleFocus = (e: any) => {
    if (!dropdownRef.current || !dropdownRef.current.contains(e.target)) {
      toggle(true);
    }
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  const handleSetValue = (country: Country) => () => {
    setFieldValue(id, country.name);
    if (handleChange) {
      handleChange(country);
    }
    setTimeout(() => {
      toggle(false);
    }, 0);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    inputRef.current?.addEventListener('focus', toggleFocus);
    return () => inputRef.current?.removeEventListener('focus', toggleFocus);
  }, []);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const response = await API.getGeolocationInfo(
          mainAppStore.initModel.authUrl
        );
        handleSetValue(response);
      } catch (error) {}
    }
    fetchCountry();
  }, []);

  const renderItems = () => {
    const filteredList = dropdownItemsList.filter(
      (item) => !value || item.name.toLowerCase().includes(value.toLowerCase())
    );
    return filteredList.length ? (
      filteredList.map((item) => (
        <DropdownItem key={item.id} onClick={handleSetValue(item)}>
          <DialText color="#ffffff" fontSize="16px">
            +{item.dial}
          </DialText>
          <DropdownItemText color="#ffffff" fontSize="16px">
            {item.name}
          </DropdownItemText>
        </DropdownItem>
      ))
    ) : (
      <PrimaryTextSpan fontSize="11px" color="rgba(255,255,255,0.4)">
        {t('No matches')}
      </PrimaryTextSpan>
    );
  };
  return (
    <LabelWrapper htmlFor={id} ref={wrapperRef} onMouseDown={toggleFocus}>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        name={name}
        onChange={onChange}
        value={value}
        required
        hasError={hasError}
        autoComplete={autoComplete}
      />
      <Label>{labelText}</Label>
      <SvgIcon
          {...IconArrowLink}
          width={12}
          height={12}
          fillColor="#c4c4c4"
      />
      {on && (
        <DropdownWrapper
          ref={dropdownRef}
          flexDirection="column"
          padding="16px"
          position="absolute"
          top="100%"
          left="0"
          right="0"
          zIndex="101"
          backgroundColor="#1C2026"
        >
          {renderItems()}
        </DropdownWrapper>
      )}
    </LabelWrapper>
  );
};

export default AutoCompleteDropdown;

const LabelWrapper = styled.label`
  display: flex;
  position: relative;
  margin: 0;
  padding-top: 24px;
  svg {
    position: absolute;
    right: 16px;
    top: 43px;
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  background-color: rgba(42, 45, 56, 0.5);
  outline: none;
  border: none;
  border-bottom: #1c1f26 2px solid;
  border-bottom: ${(props) => props.hasError && '1px solid #ED145B !important'};
  width: 100%;
  caret-color: #fff;
  color: #fffccc;
  font-size: 16px;
  line-height: 16px;
  padding: 14px 42px 14px 16px;
  transition: border 0.2s ease;
  will-change: border;
  text-align: right;
  transition: 0.4s;

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
    font-size: 16px !important;
    -webkit-text-fill-color: #fffccc !important;
    box-shadow: 0 0 0px 1000px #1d2026 inset !important;
    -webkit-box-shadow: 0 0 0px 1000px #1d2026 inset !important;
    transition: background-color 5000s linear 0s !important;
    background-clip: content-box !important;
  }
`;

const Label = styled(PrimaryTextSpan)`
  position: absolute;
  bottom: 12px;
  left: 14px;
  transform: translateY(-4px);
  transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
`;

const DialText = styled(PrimaryTextSpan)`
  display: flex;
  width: 60px;
  justify-content: flex-end;
  margin-right: 15px;
  text-align: right;
`;

const DropdownWrapper = styled(FlexContainer)`
  max-height: calc(100vh - 217px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const DropdownItem = styled(FlexContainer)`
  font-size: 16px;
  box-sizing: border-box;
  min-height: 50px;
  align-items: center;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    > p {
      color: #21b3a4;
    }
  }
`;

const DropdownItemText = styled(PrimaryTextParagraph)`
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
  }
`;
