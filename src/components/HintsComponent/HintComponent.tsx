import React, { useEffect, useState } from 'react';
import { FULL_VH } from '../../constants/global';
import { HINT_DATA } from '../../constants/hintsData';
import { HintEnum } from '../../enums/HintEnum';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import { IHint, IHintsData } from '../../types/HintTypes';
import Modal from '../Modal';
import HintBlock from './HintBlock';

interface Props {
  hintType: HintEnum;
}

const HintComponent = ({ hintType }: Props) => {
  const { educationStore } = useStores();

  const [step, setStep] = useState<number>(0);
  const [activeFlowData, setData] = useState<IHint[] | null>(null);

  const handleClose = () => {
    educationStore.closeHint();
  };

  const handleNext = () => {
    const totalCount = activeFlowData?.length || 0;
    if (activeFlowData === null || activeFlowData[step].order === totalCount) {
      return;
    }
    setStep(step + 1);
  };

  useEffect(() => {
    setData(HINT_DATA[hintType] || null);
  }, [hintType]);

  if (activeFlowData === null) {
    return null;
  }

  return (
    <Modal>
      <FlexContainer
        position="fixed"
        zIndex="99"
        width="100vw"
        maxWidth="414px"
        height={`calc(${FULL_VH})`}
        top="0"
        left="0"
        right="0"
        margin="0 auto"
        flexWrap="wrap"
      >
        <HintBlock
          item={activeFlowData[step]}
          onClose={handleClose}
          onNext={handleNext}
          total={activeFlowData.length}
          currentStepNum={activeFlowData[step].order}
        />
      </FlexContainer>
    </Modal>
  );
};

export default HintComponent;
