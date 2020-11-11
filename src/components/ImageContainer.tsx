import React, { FC } from 'react';
import styled from '@emotion/styled';
import { getImageSource } from '../helpers/getImageSource';
import { useStores } from '../hooks/useStores';
import { observer } from 'mobx-react-lite';

interface Props {
  instrumentId: string;
}

const ImageContainer: FC<Props> = observer((props) => {
  const { instrumentId } = props;
  const { mainAppStore } = useStores();

  return (
    <ImageElem
      src={`${mainAppStore.tradingUrl}${getImageSource(instrumentId)}`}
    />
  );
});

export default ImageContainer;

const ImageElem = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
`;
