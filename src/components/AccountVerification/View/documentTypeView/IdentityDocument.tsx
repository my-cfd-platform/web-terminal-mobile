import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Colors from '../../../../constants/Colors';
import { useStores } from '../../../../hooks/useStores';
import { ButtonWithoutStyles } from '../../../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../../../styles/TextsElements';
import SvgIcon from '../../../SvgIcon';

import IconArrowLink from '../../../../assets/svg/profile/icon-arrow-link.svg';
import IconPassport from '../../../../assets/svg_no_compress/kyc/icons-document/icon-passport.svg';
import IconDrivingCard from '../../../../assets/svg_no_compress/kyc/icons-document/icon-driving-licence.svg';
import IconIDCard from '../../../../assets/svg_no_compress/kyc/icons-document/icon-id-card.svg';
import { IdentityDocumentTypeEnum } from '../../../../enums/KYC/IdentityDocumentTypeEnum';
import IdentityPassport from '../FormContainer/IdentityPassport';
import IdentityDrivingLicence from '../FormContainer/IdentityDrivingLicence';
import IdentityIDCard from '../FormContainer/IdentityIDCard';

const DOCUMENTS = [
  {
    id: IdentityDocumentTypeEnum.PASSPORT,
    name: 'Passport',
    icon: IconPassport,
  },
  {
    id: IdentityDocumentTypeEnum.DRIVING_LICENCE,
    name: 'Driving Licence',
    icon: IconDrivingCard,
  },
  {
    id: IdentityDocumentTypeEnum.ID_CARD,
    name: 'ID card',
    icon: IconIDCard,
  },
];

const IdentityDocument = () => {
  const { kycStore } = useStores();

  const [
    activeDocument,
    setActiveDocument,
  ] = useState<IdentityDocumentTypeEnum | null>(null);

  const selectDocument = (doc: IdentityDocumentTypeEnum) => {
    setActiveDocument(doc);
  };

  const renderDocumentView = () => {
    switch (activeDocument) {
      case IdentityDocumentTypeEnum.PASSPORT:
        return <IdentityPassport />;
      case IdentityDocumentTypeEnum.DRIVING_LICENCE:
        return <IdentityDrivingLicence />;
      case IdentityDocumentTypeEnum.ID_CARD:
        return <IdentityIDCard />;
      default:
        return <DocumentList onSelectDocument={selectDocument} />;
    }
  };

  useEffect(() => {
    kycStore.hideConfirmButton();
    return () => {
      kycStore.showConfirmButton();
    };
  }, []);

  return <FlexContainer flex="1">{renderDocumentView()}</FlexContainer>;
};

export default IdentityDocument;

interface Props {
  onSelectDocument: (doc: IdentityDocumentTypeEnum) => void;
}
const DocumentList = ({ onSelectDocument }: Props) => {
  const { t } = useTranslation();
  return (
    <FlexContainer flexDirection="column" flex="1">
      <FlexContainer
        width="100%"
        justifyContent="center"
        marginBottom="24px"
        alignItems="center"
      >
        <PrimaryTextSpan color="#ffffff" fontSize="16px" fontWeight={600}>
          {t("Select one of the document's type")}
        </PrimaryTextSpan>
      </FlexContainer>
      {DOCUMENTS.map((button) => (
        <ProfileMenuButton
          key={button.id}
          onClick={() => {
            onSelectDocument(button.id);
          }}
        >
          <FlexContainer alignItems="center">
            <FlexContainer
              width="28px"
              height="28px"
              backgroundColor="#77797D"
              borderRadius="50%"
              justifyContent="center"
              alignItems="center"
              marginRight="14px"
            >
              <SvgIcon {...button.icon} fillColor="#ffffff" />
            </FlexContainer>
            <PrimaryTextSpan
              color="#ffffff"
              fontSize="16px"
              fontWeight="normal"
              textTransform="capitalize"
            >
              {t(button.name)}
            </PrimaryTextSpan>
          </FlexContainer>
          <SvgIcon {...IconArrowLink} fillColor="rgba(196, 196, 196, 0.5)" />
        </ProfileMenuButton>
      ))}
    </FlexContainer>
  );
};

const ProfileMenuButton = styled(ButtonWithoutStyles)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 8px 16px;
  text-decoration: none;
  background-color: rgba(42, 45, 56, 0.5);
  margin-bottom: 1px;
  &:active {
    cursor: pointer;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.1)
      ),
      rgba(42, 45, 56, 0.5);
    text-decoration: none;
  }
`;
