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
import { ObjectKeys } from '../../helpers/objectKeys';
import styled from '@emotion/styled';
import moment from 'moment';
import { IActiveInstrument } from '../../types/InstrumentsTypes';
import { observer } from 'mobx-react-lite';

const TimeScalePanel = observer(() => {
  const { instrumentsStore, tradingViewStore } = useStores();

  const handleChangeResolution = (
    newInterval: SupportedIntervalsType
  ) => () => {
    let from = moment();
    let newResolutionKey: SupportedResolutionsType = '1 minute';
    switch (newInterval) {
      case supportedInterval['1D']:
        from = moment().subtract(1, 'd');
        newResolutionKey = '1 minute';
        break;

      case supportedInterval['5D']:
        from = moment().subtract(5, 'd');
        newResolutionKey = '30 minutes';
        break;

      case supportedInterval['1M']:
        from = moment().subtract(1, 'M');
        newResolutionKey = '1 hour';
        break;

      case supportedInterval['YTD']:
        from = moment().subtract(new Date().getUTCMonth(), 'M');
        newResolutionKey = '1 day';
        break;

      case supportedInterval['1Y']:
        from = moment().subtract(1, 'year');
        newResolutionKey = '1 day';
        break;

      case supportedInterval['3Y']:
        from = moment().subtract(1, 'y');
        newResolutionKey = '1 month';
        break;

      case supportedInterval['All']:
        from = moment().subtract(1, 'y');
        newResolutionKey = '1 month';
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
    if (newResolutionKey === instrumentsStore.activeInstrument!.resolution) {
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
      {ObjectKeys(supportedInterval).map((key) => (
        <TimeScaleButton key={key} onClick={handleChangeResolution(key)}>
          <PrimaryTextSpan
            color={
              instrumentsStore.activeInstrument?.interval ===
              supportedInterval[key]
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
