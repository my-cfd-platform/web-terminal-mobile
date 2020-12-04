import React from 'react';
import BackFlowLayout from '../components/BackFlowLayout';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from '../components/SvgIcon';

import IconArea from '../assets/svg/chart-types/icon-area.svg';
import IconLine from '../assets/svg_no_compress/icon-line.svg';
import IconCandle from '../assets/svg/chart-types/icon-candle.svg';
import Colors from '../constants/Colors';
import { LOCAL_CHART_TYPE } from '../constants/global';
import { getChartLabelByType } from '../constants/chartValues';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import {
  ResolutionString,
  SeriesStyle,
} from '../vendor/charting_library/charting_library';
import {
  SupportedResolutionsType,
  supportedResolutions,
} from '../constants/supportedTimeScales';
import { IActiveInstrument } from '../types/InstrumentsTypes';
import { ObjectKeys } from '../helpers/objectKeys';
import { useHistory } from 'react-router-dom';

const ChartSetting = observer(() => {
  const { t } = useTranslation();
  const { instrumentsStore, tradingViewStore } = useStores();
  const { goBack } = useHistory();

  const handleChangeResolution = (
    resolutionKey: SupportedResolutionsType
  ) => () => {
    tradingViewStore.tradingWidget
      ?.chart()
      .setResolution(
        supportedResolutions[resolutionKey] as ResolutionString,
        () => {
          if (instrumentsStore.activeInstrument) {
            instrumentsStore.editActiveInstrument({
              ...instrumentsStore.activeInstrument,
              resolution: resolutionKey,
              interval: null,
            });
          }
          goBack();
        }
      );
  };
  const handleChangeChartType = (chartType: SeriesStyle) => () => {
    if (instrumentsStore.activeInstrument) {
      tradingViewStore.tradingWidget?.chart().setChartType(chartType);
      const newActiveInstrument: IActiveInstrument = {
        ...instrumentsStore.activeInstrument,
        chartType: chartType,
      };
      localStorage.setItem(LOCAL_CHART_TYPE, getChartLabelByType(chartType));
      instrumentsStore.editActiveInstrument(newActiveInstrument);
      goBack();
    }
  };

  return (
    <BackFlowLayout pageTitle="Chart Settings">
      <FlexContainer flexDirection="column" padding="0 16px">
        <FlexContainer marginBottom="16px">
          <PrimaryTextSpan
            fontSize="13px"
            color="rgba(255, 255, 255, 0.4)"
            textTransform="uppercase"
          >
            {t('Chart type')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer marginBottom="40px">
          <TypeButton
            onClick={handleChangeChartType(SeriesStyle.Line)}
            isActive={
              instrumentsStore.activeInstrument?.chartType === SeriesStyle.Line
            }
          >
            <SvgIcon {...IconLine} fillColor="#23262F" />
          </TypeButton>
          <TypeButton
            onClick={handleChangeChartType(SeriesStyle.Candles)}
            isActive={
              instrumentsStore.activeInstrument?.chartType ===
              SeriesStyle.Candles
            }
          >
            <SvgIcon {...IconCandle} fillColor="#23262F" />
          </TypeButton>
          <TypeButton
            onClick={handleChangeChartType(SeriesStyle.Area)}
            isActive={
              instrumentsStore.activeInstrument?.chartType === SeriesStyle.Area
            }
          >
            <SvgIcon {...IconArea} fillColor="#23262F" />
          </TypeButton>
        </FlexContainer>

        <FlexContainer marginBottom="16px">
          <PrimaryTextSpan
            fontSize="13px"
            color="rgba(255, 255, 255, 0.4)"
            textTransform="uppercase"
          >
            {t('Time frame')}
          </PrimaryTextSpan>
        </FlexContainer>
        <FlexContainer marginBottom="40px">
          {ObjectKeys(supportedResolutions).map((key) => (
            <TimeFrameButton
              onClick={handleChangeResolution(key)}
              key={key}
              isActive={key === instrumentsStore.activeInstrument?.resolution}
            >
              {key}
            </TimeFrameButton>
          ))}
        </FlexContainer>
      </FlexContainer>
    </BackFlowLayout>
  );
});

export default ChartSetting;

const TypeButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  width: 64px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.isActive ? Colors.ACCENT : 'rgba(196, 196, 196, 0.5)'};
  border-radius: 4px;
  transition: all 0.4s ease;
  &:not(:last-of-type) {
    margin-right: 8px;
  }
`;

const TimeFrameButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  font-size: 16px;
  color: ${(props) =>
    props.isActive ? Colors.ACCENT : 'rgba(196, 196, 196, 0.5)'};

  &:not(:last-of-type) {
    margin-right: 24px;
  }
`;
