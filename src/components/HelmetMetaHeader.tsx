import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks/useStores';

const HelmetMetaHeader: FC = observer(() => {
  const { mainAppStore } = useStores();
  const { t } = useTranslation();
  return (
    <>
      
    </>
  );
});

export default HelmetMetaHeader;
