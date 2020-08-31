import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SvgIcon from '../SvgIcon';
import IconLine from '../../assets/svg_no_compress/icon-line-gray.svg';
import IconArea from '../../assets/svg/chart-types/icon-area.svg';
import IconCandle from '../../assets/svg/chart-types/icon-candle.svg';
import TimeScalePanel from './TimeScalePanel';
import { Link } from 'react-router-dom';
import Page from '../../constants/Pages';
import { useStores } from '../../hooks/useStores';
import { SeriesStyle } from '../../vendor/charting_library/charting_library.min';
import { observer } from 'mobx-react-lite';

const TimeScaleWrapper = observer(() => {
  const { instrumentsStore } = useStores();

  const renderChartTypeIcon = () => {
    switch (instrumentsStore.activeInstrument?.chartType) {
      case SeriesStyle.Line:
        return (
          <SvgIcon
            {...IconLine}
            width={16}
            height={16}
            fillColor="rgba(196, 196, 196, 0.5)"
          />
        );

      case SeriesStyle.Area:
        return (
          <SvgIcon
            {...IconArea}
            width={16}
            height={16}
            fillColor="rgba(196, 196, 196, 0.5)"
          />
        );

      case SeriesStyle.Candles:
        return (
          <SvgIcon
            {...IconCandle}
            width={16}
            height={16}
            fillColor="rgba(196, 196, 196, 0.5)"
          />
        );

      default:
        return (
          <SvgIcon
            {...IconArea}
            width={16}
            height={16}
            fillColor="rgba(196, 196, 196, 0.5)"
          />
        );
    }
  };
  return (
    <FlexContainer
      justifyContent="space-between"
      padding="8px 16px"
      marginBottom="12px"
    >
      <FlexContainer>
        <Link to={Page.CHART_SETTING}>{renderChartTypeIcon()}</Link>
      </FlexContainer>
      <TimeScalePanel></TimeScalePanel>
    </FlexContainer>
  );
});

export default TimeScaleWrapper;
