import { css } from '@emotion/core';
import BoldWoff2 from '../assets/fonts/sfuitext-bold-webfont.woff2';
import BoldWoff from '../assets/fonts/sfuitext-bold-webfont.woff';
import lightWoff2 from '../assets/fonts/sfuitext-light-webfont.woff2';
import lightWoff from '../assets/fonts/sfuitext-light-webfont.woff';
import MediumWoff2 from '../assets/fonts/sfuitext-medium-webfont.woff2';
import MediumWoff from '../assets/fonts/sfuitext-medium-webfont.woff';
import RegularWoff2 from '../assets/fonts/sfuitext-regular-webfont.woff2';
import RegularWoff from '../assets/fonts/sfuitext-regular-webfont.woff';

export const SFfonts = css`
  @font-face {
    font-family: 'sf_ui_text';
    src: url(${BoldWoff2}) format('woff2'), url(${BoldWoff}) format('woff');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'sf_ui_text';
    src: url(${lightWoff2}) format('woff2'), url(${lightWoff}) format('woff');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'sf_ui_text';
    src: url(${MediumWoff2}) format('woff2'), url(${MediumWoff}) format('woff');
    font-weight: medium;
    font-style: normal;
  }

  @font-face {
    font-family: 'sf_ui_text';
    src: url(${RegularWoff2}) format('woff2'),
      url(${RegularWoff}) format('woff');
    font-weight: normal;
    font-style: normal;
  }
`;
