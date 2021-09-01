import React, { FC, useEffect } from 'react';
import {
  ChartingLibraryWidgetOptions,
  widget,
  SeriesStyle,
  ResolutionString,
} from '../vendor/charting_library/charting_library';
import { FlexContainer } from '../styles/FlexContainer';
import DataFeedService from '../services/dataFeedService';
import { LineStyles } from '../enums/TradingViewStyles';
import { useStores } from '../hooks/useStores';
import { supportedResolutions } from '../constants/supportedTimeScales';
import { BASIC_RESOLUTION_KEY } from '../constants/chartValues';
import { observer } from 'mobx-react-lite';
import { useRouteMatch } from 'react-router-dom';
import Page from '../constants/Pages';
import styled from '@emotion/styled';

const containerId = 'tv_chart_container';

const ChartContainer: FC = observer(() => {
  const {
    mainAppStore,
    tradingViewStore,
    instrumentsStore,
    markersOnChartStore,
  } = useStores();

  const match = useRouteMatch(Page.DASHBOARD);
  // TODO: think how to improve logic

  useEffect(() => {
    if (
      !tradingViewStore.tradingWidget &&
      mainAppStore.activeSession &&
      instrumentsStore.activeInstrument &&
      instrumentsStore.instruments.length &&
      match?.isExact
    ) {
      mainAppStore.isLoading = true;
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: instrumentsStore.activeInstrument.instrumentItem.id,
        datafeed: new DataFeedService(
          mainAppStore.activeSession,
          instrumentsStore.activeInstrument.instrumentItem.id,
          instrumentsStore.instruments
        ),
        interval: supportedResolutions[
          BASIC_RESOLUTION_KEY
        ] as ResolutionString,
        container_id: containerId,
        library_path: CHARTING_LIBRARY_PATH,
        locale: 'en',
        custom_css_url: 'custom_trading_view_styles.css',
        disabled_features: [
          'header_widget',
          'timeframes_toolbar',
          'use_localstorage_for_settings',
          'border_around_the_chart',
          'left_toolbar',
          'symbol_info',
          'context_menus',
          'main_series_scale_menu',
          'popup_hints',
        ],
        enabled_features: ['remove_library_container_border'],
        theme: 'Dark',
        loading_screen: {
          backgroundColor: 'transparent',
          foregroundColor: 'transparent',
        },
        fullscreen: false,
        autosize: true,
        overrides: {
          'symbolWatermarkProperties.transparency': 90,
          'mainSeriesProperties.style': SeriesStyle.Area,
          'mainSeriesProperties.lineStyle.color': '#00FFF2',
          'mainSeriesProperties.lineStyle.linestyle':
            LineStyles.LINESTYLE_SOLID,
          'mainSeriesProperties.lineStyle.linewidth': 2,
          'mainSeriesProperties.lineStyle.priceSource': 'close',
          'mainSeriesProperties.areaStyle.color1': 'rgba(0, 255, 221, 0.08)',
          'mainSeriesProperties.areaStyle.color2': 'rgba(0, 255, 221, 0.08)',
          'mainSeriesProperties.areaStyle.linecolor': '#00FFF2',
          'mainSeriesProperties.areaStyle.linestyle':
            LineStyles.LINESTYLE_SOLID,
          'mainSeriesProperties.areaStyle.linewidth': 2,
          'mainSeriesProperties.candleStyle.upColor': '#21B3A4',
          'mainSeriesProperties.candleStyle.downColor': '#ed145b',
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.drawBorder': false,
          'mainSeriesProperties.candleStyle.borderColor': '#28555a',
          'mainSeriesProperties.candleStyle.borderUpColor': '#21B3A4',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ed145b',
          'mainSeriesProperties.candleStyle.wickUpColor': '#255258',
          'mainSeriesProperties.candleStyle.wickDownColor': '#622243',
          'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
          'mainSeriesProperties.areaStyle.priceSource': 'close',
          'paneProperties.axisProperties.autoScale': false,
          'paneProperties.vertGridProperties.color':
            'rgba(255, 255, 255, 0.08)',
          'paneProperties.vertGridProperties.style':
            LineStyles.LINESTYLE_DOTTED,
          'paneProperties.horzGridProperties.color':
            'rgba(255, 255, 255, 0.08)',
          'paneProperties.horzGridProperties.style':
            LineStyles.LINESTYLE_DOTTED,
          'paneProperties.legendProperties.showStudyArguments': false,
          'paneProperties.legendProperties.showStudyTitles': false,
          'paneProperties.legendProperties.showStudyValues': false,
          'paneProperties.legendProperties.showSeriesTitle': false,
          'paneProperties.legendProperties.showSeriesOHLC': true,
          'paneProperties.legendProperties.showLegend': false,
          'paneProperties.legendProperties.showBarChange': false,
          'linetoolnote.backgroundColor': '#ED145B',
          'scalesProperties.lineColor': 'transparent',
          'scalesProperties.textColor': 'rgba(255, 255, 255, 0.2)',
          'paneProperties.background': 'rgba(0,0,0,0)',
          'mainSeriesProperties.priceLineColor': '#fff',
          'mainSeriesProperties.priceLineWidth': 2,
          'scalesProperties.showSeriesLastValue': true,
          'timeScale.rightOffset': 0,
        },
      };
      const tvWidget = new widget(widgetOptions);
      tvWidget.onChartReady(async () => {
        tradingViewStore.tradingWidget = tvWidget;
        mainAppStore.isLoading = false;
        markersOnChartStore.renderActivePositionsMarkersOnChart();

        // const fromTo = {
        //   from: getIntervalByKey('15m') / 1000,
        //   to: moment.utc().valueOf() / 1000,
        // };
        // tvWidget.activeChart().setVisibleRange(fromTo);

        if (
          instrumentsStore.activeInstrument &&
          instrumentsStore.activeInstrument.chartType
        ) {
          tvWidget
            .chart()
            .setChartType(instrumentsStore.activeInstrument?.chartType);
        }
      });
    }
  }, [
    mainAppStore.activeSession,
    instrumentsStore.activeInstrument,
    instrumentsStore.instruments,
    tradingViewStore.tradingWidget,
    match,
  ]);

  return (
    <ChartElement
      width="100%"
      height="calc(100% - 228px)"
      id={containerId}
      order="2"
      display={match?.isExact ? 'flex' : 'none'}
    />
  );
});

export default ChartContainer;

const ChartElement = styled(FlexContainer)<{
  display: 'flex' | 'none';
}>`
  display: ${(props) => props.display};
`;
