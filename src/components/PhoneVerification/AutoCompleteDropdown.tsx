import React, { FC, ChangeEvent, useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import Colors from '../../constants/Colors';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import { FlexContainer } from '../../styles/FlexContainer';
import { Country } from '../../types/CountriesTypes';
import { useTranslation } from 'react-i18next';
import IconArrowLink from '../../assets/svg/profile/icon-arrow-link.svg';
import SvgIcon from '../SvgIcon';
import IconBackBtn from '../../assets/svg/icon-back-btn.svg';
import IconSearch from '../../assets/svg/icon-search.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

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
  const [searchInput, setSearchInput] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const wrapperRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(document.createElement('input'));

  const { t } = useTranslation();

  const handleSetValue = (country: Country) => () => {
    setFieldValue(id, country.name);
    if (handleChange) {
      handleChange(country);
    }
    setTimeout(() => {
      setSearchInput('');
      setShowSearchInput(false);
      toggle(false);
    }, 0);
  };

  const handleChangeSearchInput = (e: any) => {
    setSearchInput(e.target.value);
  };

  const handleOpenDropDown = () => {
    toggle(!on);
  };

  const handleShowSearchInput = () => {
    setShowSearchInput(true);
    setTimeout(() => {
      searchInputRef.current.focus();
    }, 0);
  };

  const renderItems = () => {
    const filteredList = dropdownItemsList.filter(
      (item) => !searchInput
          || item.name.toLowerCase().includes(searchInput.toLowerCase())
          || `+${item.dial}`.toLowerCase().includes(searchInput.toLowerCase())
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
    <FlexContainer flexDirection={'column'}>
      <LabelWrapper htmlFor={id} ref={wrapperRef}>
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
          onClick={handleOpenDropDown}
          readOnly={true}
        />
        <Label>{labelText}</Label>
        <SvgIcon {...IconArrowLink} width={12} height={12} fillColor="#c4c4c4" />
      </LabelWrapper>
      {on && (
        <DropdownPopup
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="101"
          backgroundColor="#1C2026"
          flexDirection="column"
        >
          <HeaderDropdown padding="16px">
            { showSearchInput
              ? <SearchPanel width={'100%'} position={'relative'} justifyContent={'space-between'}>
                  <SvgIcon {...IconSearch} width={16} height={16} fillColor="rgba(255, 255, 255, 1)" />
                  <SearchInput ref={searchInputRef} onChange={handleChangeSearchInput} />
                  <ButtonWithoutStyles onClick={() => setShowSearchInput(false)}>
                    <PrimaryTextSpan fontSize="16px" color="#fff">{t('Cancel')}</PrimaryTextSpan>
                  </ButtonWithoutStyles>
                </SearchPanel>
              : <React.Fragment>
                  <ButtonWithoutStyles onClick={handleOpenDropDown}>
                    <SvgIcon {...IconBackBtn} width={16} height={16} fillColor="rgba(255, 255, 255, 0.5)" />
                  </ButtonWithoutStyles>
                  <PageTitle fontSize={'16px'} color={'#fff'}>
                    {t('Country')}
                  </PageTitle>
                  <ButtonWithoutStyles onClick={handleShowSearchInput}>
                    <SvgIcon {...IconSearch} width={16} height={16} fillColor="rgba(196, 196, 196, 0.5)" />
                  </ButtonWithoutStyles>
                </React.Fragment>
            }
          </HeaderDropdown>
          <DropdownWrapper
            ref={dropdownRef}
            flexDirection="column"
          >
            {renderItems()}
          </DropdownWrapper>
        </DropdownPopup>
      )}
    </FlexContainer>
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
  padding: 14px 42px 14px 85px;
  transition: border 0.2s ease;
  will-change: border;
  text-align: right;
  transition: 0.4s;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

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
  bottom: 13px;
  left: 14px;
  transform: translateY(-4px);
  transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
`;

const DialText = styled(PrimaryTextSpan)`
  display: flex;
  min-width: 80px;
  max-width: 80px;
  justify-content: flex-end;
  margin-right: 15px;
  text-align: right;
`;

const DropdownWrapper = styled(FlexContainer)`
  height: calc(100vh - 80px);
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

const DropdownPopup = styled(FlexContainer)`
  height: 100vh;
`;

const SearchInput = styled.input`
  caret-color: #fff;
  color: #fff;
  padding: 0 14px 0 45px;
  font-size: 16px;
  line-height: 16px;
  background: ${Colors.NOTIFICATION_BG};
  outline: none;
  border: none;
  border-radius: 8.91px;
  height: 32px;
  width: calc(100% - 64px);
  &:active,
  &:focus {
    background-color: ${Colors.NOTIFICATION_BG};
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

const HeaderDropdown = styled(FlexContainer)`
  position: relative;
  min-height: 80px;
  justify-content: space-between;
  align-items: center;
  svg {
    position: static;
  }
`;

const SearchPanel = styled(FlexContainer)`
  position: relative;
  svg {
    position: absolute;
    left: 16px;
    top: 8px;
  }
`;

const PageTitle = styled(PrimaryTextSpan)`
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
`;

const DropdownItem = styled(FlexContainer)`
  font-size: 16px;
  box-sizing: border-box;
  min-height: 50px;
  align-items: center;
  border-bottom: 2px solid #1C1F26;
  background: rgba(42, 45, 56, 0.5);
  padding: 0 15px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const DropdownItemText = styled(PrimaryTextParagraph)`
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
  }
`;
