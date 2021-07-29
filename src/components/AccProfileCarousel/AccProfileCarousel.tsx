import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import BonusBanner from './BonusBanner';
import OnBoardingBanner from './OnBoardingBanner';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './style-carousel.css';

const AccProfileCarousel = () => {
  return (
    <FlexContainer marginBottom="16px" width="100%" padding="0 8px">
      <OwlCarousel className="owl-theme" items={1} stagePadding={8} margin={4}>
        <BonusBanner />
        <OnBoardingBanner />
      </OwlCarousel>
    </FlexContainer>
  );
};

export default AccProfileCarousel;
