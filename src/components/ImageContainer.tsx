import React from 'react';
import styled from '@emotion/styled';
import { getImageSource } from '../helpers/getImageSource';
import { useStores } from '../hooks/useStores';

interface Props {
  instrumentId: string;
}

function ImageContainer(props: Props) {
  const { instrumentId } = props;
  const { mainAppStore } = useStores();

  return (
    <ImageElem
      src={`${mainAppStore.tradingUrl}${getImageSource(instrumentId)}`}
    />
  );
}

export default ImageContainer;

const ImageElem = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
`;
