import React, { FC, useState } from 'react';
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
  const [isEmpty, setEmpty] = useState(false);
  const handleError = () => setEmpty(true);

  return (
    <>
      {isEmpty ? (
        <EmptyBlock />
      ) : (
        <ImageElem
          loading="lazy"
          src={`${
            API_STRING || mainAppStore.initModel.tradingUrl
          }${getImageSource(instrumentId)}`}
          onError={handleError}
        />
      )}
    </>
  );
});

export default ImageContainer;

const EmptyBlock = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #384250;
`;
const ImageElem = styled.img`
  display: block;
  object-fit: contain;
  width: 100%;
`;
