import styled from '@emotion/styled-base';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccStatusData from '../../constants/AccountStatusData';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import { v4 as uuid } from 'uuid';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

import { AccountStatusTableTooltip } from '../../constants/AccountStatusTableTooltip';
import ConfirmationPopup from '../ConfirmationPopup';

import IconGoldTag from '../../assets/svg_no_compress/account-status/icon-gold-status-tag.svg';
import IconTooltip from '../../assets/svg_no_compress/account-status/icon-tooltip.svg';
import IconScroll from '../../assets/svg_no_compress/account-status/icon-scroll-btn.svg';

const AboutStatusTable = () => {
  const { t } = useTranslation();
  const scrollWrap = useRef<HTMLDivElement>(null);
  const [statusData] = useState(Object.values(AccStatusData));
  const [isScrollBtn, showScrollBtn] = useState(true);

  const handleClickScroll = () => {
    showScrollBtn(false);

    if (scrollWrap.current) {
      scrollWrap.current.scrollLeft = scrollWrap.current.scrollWidth;
    }
  };
  return (
    <FlexContainer width="100vw" position="relative">
      <ScrollViewOverlay>
        {isScrollBtn && (
          <ScrollToEndBtn onClick={handleClickScroll}>
            <SvgIcon {...IconScroll} />
          </ScrollToEndBtn>
        )}
      </ScrollViewOverlay>

      <FlexContainer marginRight="2px" flexDirection="column" width="114px">
        <TitleCell
          height="54px"
          width="112px"
          alignItems="center"
          padding="16px 6px 16px 16px"
          justifyContent="space-between"
          marginBottom="2px"
          background="transparent"
        >
          <PrimaryTextSpan
            fontSize="13px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.64)"
          >
            {t('Status')}
          </PrimaryTextSpan>
        </TitleCell>
        {statusData.map((el) => (
          <TitleCell
            key={uuid()}
            height="54px"
            width="112px"
            alignItems="center"
            padding="16px 6px 16px 16px"
            justifyContent="space-between"
            marginBottom="2px"
            background={
              el.name === 'Gold'
                ? 'linear-gradient(90deg, rgba(255, 252, 204, 0.2) 0%, rgba(255, 252, 204, 0) 100%), #252933;'
                : '#252933'
            }
          >
            <PrimaryTextSpan fontWeight="bold" fontSize="16px" color={el.color}>
              {t(el.name)}
            </PrimaryTextSpan>

            {el.name === 'Gold' && <SvgIcon {...IconGoldTag} />}
          </TitleCell>
        ))}
      </FlexContainer>

      <FlexContainer
        ref={scrollWrap}
        flex="1"
        width="calc(100vw - 114px)"
        overflowX="auto"
      >
        <FlexContainer flexDirection="column">
          <CellRowContainer
            marginBottom="2px"
            height="54px"
            alignItems="center"
          >
            {AccountStatusTableTooltip.map((item) => (
              <TableHeaderCellItem key={item.id} item={item} />
            ))}
          </CellRowContainer>
          {statusData.map((el) => (
            <CellRowContainer
              backgroundColor="#252933"
              marginBottom="2px"
              height="54px"
              alignItems="center"
              key={uuid()}
            >
              {Object.values(el.description).map((desc, index) => (
                <FlexContainer
                  key={uuid()}
                  justifyContent="flex-start"
                  alignItems="center"
                  padding="4px 0 4px 12px"
                  width="144px"
                  className={
                    [5, 6].includes(index)
                      ? 'short'
                      : [2].includes(index)
                      ? 'long'
                      : ''
                  }
                >
                  <PrimaryTextSpan color="#fff" fontSize="14px">
                    {desc}
                  </PrimaryTextSpan>
                </FlexContainer>
              ))}
            </CellRowContainer>
          ))}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AboutStatusTable;

const ScrollViewOverlay = styled(FlexContainer)`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 32px;
  height: calc(100% - 56px);
  background: linear-gradient(
    90deg,
    rgba(28, 31, 38, 0.8) 0%,
    rgba(28, 31, 38, 0) 100%
  );
  transform: rotate(-180deg);
`;

const ScrollToEndBtn = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #cae2f6;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  position: absolute;
  top: 50%;
  right: -16px;
  transform: translateY(-50%) rotate(180deg);

  transition: background 0.4s ease;

  &:active {
    background: #9ec6e7;
  }
`;

const TitleCell = styled(FlexContainer)<{ background: string }>`
  background: ${(props) => props.background};
`;

const CellRowContainer = styled(FlexContainer)`
  .short {
    width: 100px;
  }
  .long {
    width: 170px;
  }
`;

interface TableHeaderCellItemProps {
  item: {
    id: string;
    label: string;
    tooltipText: string;
    blockWidth: string;
  };
}
const TableHeaderCellItem = ({ item }: TableHeaderCellItemProps) => {
  const { t } = useTranslation();
  const [on, toggle] = useState(false);
  const handleClickOpen = () => {
    toggle(true);
  };
  const closeAction = () => {
    toggle(false);
  };
  return (
    <FlexContainer
      justifyContent="flex-start"
      alignItems="center"
      padding="4px 0 4px 12px"
      width={item.blockWidth}
    >
      {on && (
        <ConfirmationPopup confirmAction={closeAction} isInfo={true}>
          {t(`${item.tooltipText}`)}
        </ConfirmationPopup>
      )}
      <PrimaryTextSpan
        marginRight="6px"
        fontSize="13px"
        textTransform="uppercase"
        color="rgba(255, 255, 255, 0.64)"
      >
        {t(`${item.label}`)}
      </PrimaryTextSpan>

      <ButtonWithoutStyles onClick={handleClickOpen}>
        <SvgIcon {...IconTooltip} />
      </ButtonWithoutStyles>
    </FlexContainer>
  );
};
