import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';

import Image from "../assets/images/empty-image.png";
import { PrimaryTextParagraph } from '../styles/TextsElements';

interface Props {
  text: string;
}

const EmptyListText = (props: Props) => {
  const { text } = props;

  return (
   <FlexContainer flexDirection="column" alignItems="center" justifyContent="center">
     <FlexContainer marginBottom="16px"><img src={Image} alt=""/></FlexContainer>
      <PrimaryTextParagraph
        color="rgba(196, 196, 196, 0.5)"
        fontSize="13px"
        textAlign="center"
      >
        {text}
      </PrimaryTextParagraph>
   </FlexContainer>
  );
};

export default EmptyListText;