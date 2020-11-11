import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { useStores } from '../../hooks/useStores';
import {
  supportedInterval,
  SupportedIntervalsType,
  SupportedResolutionsType,
  supportedResolutions,
} from '../../constants/supportedTimeScales';
import styled from '@emotion/styled';
import moment from 'moment';
import { IActiveInstrument } from '../../types/InstrumentsTypes';
import { observer } from 'mobx-react-lite';

const TimeScalePanel = observer(() => {
  const { instrumentsStore, tradingViewStore } = useStores();

  const handleChangeInterval = (newInterval: SupportedIntervalsType) => () => {
    let from = moment();
    let newResolutionKey: SupportedResolutionsType = '1m';

    switch (newInterval) {
      case supportedInterval['15m']:
        from = moment().subtract(15, 'minutes');
        newResolutionKey = '1m';
        break;

      case supportedInterval['1h']:
        from = moment().subtract(1, 'hours');
        newResolutionKey = '5m';
        break;

      case supportedInterval['4h']:
        from = moment().subtract(4, 'hours');
        newResolutionKey = '15m';
        break;

      case supportedInterval['1d']:
        from = moment().subtract(1, 'days');
        newResolutionKey = '1h';
        break;

      case supportedInterval['1W']:
        from = moment().subtract(1, 'weeks');
        newResolutionKey = '4h';
        break;

      case supportedInterval['1M']:
        from = moment().subtract(1, 'months');
        newResolutionKey = '1d';
        break;

      default:
        break;
    }
    if (!instrumentsStore.activeInstrument) {
      return;
    }

    const newActiveInstrument: IActiveInstrument = {
      ...instrumentsStore.activeInstrument,
      interval: newInterval,
    };

    if (newResolutionKey === instrumentsStore.activeInstrument.resolution) {
      tradingViewStore.tradingWidget?.chart().setVisibleRange({
        from: from.valueOf(),
        to: moment().valueOf(),
      });
    } else {
      newActiveInstrument.resolution = newResolutionKey;
      tradingViewStore.tradingWidget
        ?.chart()
        .setResolution(supportedResolutions[newResolutionKey], () => {
          tradingViewStore.tradingWidget?.chart().setVisibleRange({
            from: from.valueOf(),
            to: moment().valueOf(),
          });
        });
    }
    instrumentsStore.editActiveInstrument(newActiveInstrument);
  };

  return (
    <FlexContainer>
      {Object.entries(supportedInterval).map(([key, value]: any) => (
        <TimeScaleButton key={key} onClick={handleChangeInterval(value)}>
          <PrimaryTextSpan
            color={
              instrumentsStore.activeInstrument?.interval === value
                ? '#fffccc'
                : 'rgba(196, 196, 196, 0.5)'
            }
          >
            {key}
          </PrimaryTextSpan>
        </TimeScaleButton>
      ))}
    </FlexContainer>
  );
});

export default TimeScalePanel;

const TimeScaleButton = styled(ButtonWithoutStyles)`
  margin-right: 16px;
  &:last-of-type {
    margin-right: 0;
  }
`;
