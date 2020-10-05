import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import SearchIcon from '../assets/svg/icon-search.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import styled from '@emotion/styled';
import { FlexContainer } from '../styles/FlexContainer';
import Colors from '../constants/Colors';
import { PrimaryTextSpan } from '../styles/TextsElements';

interface Props {
  position?: 'absolute';
  top?: string;
  onToggle: (on: boolean) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchPanel = (props: Props) => {
  const { position, top, onToggle, onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const [on, toggle] = useState(false);

  const openSearch = () => {
    toggle(true);
    onToggle(true);
  };
  const closeSearch = () => {
    toggle(false);
    onToggle(false)
  };

  useEffect(() => {
    inputRef?.current?.focus();
  });

  return (
    <>
      {!on && (
        <ButtonWithoutStyles onClick={openSearch}>
          <SvgIcon
            {...SearchIcon}
            fillColor="rgba(196, 196, 196, 0.5)"
            hoverFillColor="#ffffff"
          />
        </ButtonWithoutStyles>
      )}

      {on && (
        <SearchPanelWrap position={position || 'relative'} top={top}>
          <FlexContainer flex="1" padding="0 16px" position="relative">
            <FlexContainer position="absolute" top="8px" left="32px">
              <SvgIcon
                {...SearchIcon}
                fillColor="#ffffff"
                hoverFillColor="#ffffff"
              />
            </FlexContainer>
            <SearchInput onChange={onChange} ref={inputRef} />
          </FlexContainer>

          <ButtonWithoutStyles onClick={closeSearch}>
            <FlexContainer padding="0 16px 0 0">
              <PrimaryTextSpan color="#ffffff" fontSize="13px" fontWeight={500}>
                Cancel
              </PrimaryTextSpan>
            </FlexContainer>
          </ButtonWithoutStyles>
        </SearchPanelWrap>
      )}
    </>
  );
};

export default SearchPanel;

const SearchPanelWrap = styled(FlexContainer)`
  background-color: ${Colors.BACKGROUD_PAGE};
  position: ${(props) => props.position};
  top: ${(props) => props.top};
  left: 0;
  right: 0;
  z-index: 2;
  width: 100%;
  flex-wrap: wrap;
  padding: 8px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: ${Colors.NOTIFICATION_BG};
  color: #ffffff;
  outline: none;
  appearance: none;
  box-shadow: none;
  height: 32px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  padding: 0 16px 0 44px;
  &::focus,
  &:active {
    outline: none;
  }
`;
