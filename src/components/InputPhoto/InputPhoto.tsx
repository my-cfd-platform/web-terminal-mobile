import styled from '@emotion/styled';
import React, { useState } from 'react';
import Colors from '../../constants/Colors';
import { PrimaryButton } from '../../styles/Buttons';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconCamera from '../../assets/svg/profile/icon-open-camera.svg';
import IconPhotos from '../../assets/svg/profile/icon-upload.svg';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg_no_compress/icon-image-close.svg';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  label: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (name: string) => void;
  hasError?: boolean;
  errorText?: string;
  file: File | null;
  image: string;
}
const InputPhoto = ({
  name,
  label,
  hasError = false,
  errorText = '',
  file,
  image,
  onUpload,
  onRemoveImage,
}: Props) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const handleClickUploadImage = () => {
    setOpen(true);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(e);
    setOpen(false);
  };

  const fileSizeText = (size: number) => {
    const size_in_kb = Math.round(size / 1000);
    if (size_in_kb < 1000) {
      return `${size_in_kb} kb`;
    }
    return `${Math.round(size_in_kb / 1000)} mb`;
  };

  if (image && file !== null) {
    return (
      <FlexContainer width="100%" padding="16px">
        <FlexContainer
          width="100%"
          padding="16px"
          backgroundColor="rgba(255, 255, 255, 0.12)"
          border="1px solid rgba(255, 255, 255, 0.12)"
          borderRadius="4px"
          justifyContent="space-between"
          alignItems="center"
        >
          <FlexContainer flex="1" alignItems="center">
            <PhotoPreview photo={image} />

            <FlexContainer flexDirection="column" maxWidth="calc(100% - 80px)">
              <PrimaryTextSpan
                color="#ffffff"
                fontSize="16px"
                marginBottom="4px"
              >
                {file.name}
              </PrimaryTextSpan>
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.4)"
                textTransform="uppercase"
                fontSize="12px"
              >
                {fileSizeText(file.size)}
              </PrimaryTextSpan>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer>
            <ClearImageButton onClick={() => onRemoveImage(name)}>
              <SvgIcon {...IconClose} />
            </ClearImageButton>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    );
  }

  return (
    <>
      <InputLabelButton onClick={handleClickUploadImage}>
        <InputLabel
          hasError={hasError}
          width="100%"
          height="50px"
          alignItems="center"
          padding="4px 16px"
        >
          <PrimaryTextSpan textAlign="left" color="#00FFDD" fontSize="16px">
            {label}
          </PrimaryTextSpan>
        </InputLabel>
        {hasError && errorText && (
          <FlexContainer padding="8px 16px">
            <PrimaryTextSpan fontSize="13px" color="#ED145B">
              {t(errorText)}
            </PrimaryTextSpan>
          </FlexContainer>
        )}
      </InputLabelButton>

      {isOpen && (
        <FlexContainer
          flexDirection="column"
          width="100%"
          position="fixed"
          zIndex="2"
          bottom="0px"
          left="0px"
          padding="12px 16px"
        >
          <MenuToUpload flexDirection="column">
            <input
              type="file"
              onChange={handleChangeInput}
              accept="image/*, .pdf"
              capture="camera"
              id={`fileFromCamera-${name}`}
              name={`fileFromCamera-${name}`}
            />
            <input
              type="file"
              onChange={handleChangeInput}
              accept="image/*, .pdf"
              id={`fileWithoutCamera-${name}`}
              name={`fileWithoutCamera-${name}`}
            />
            <MenuToUploadItem>
              <label htmlFor={`fileFromCamera-${name}`}>
                <FlexContainer alignItems="center">
                  <FlexContainer
                    width="24px"
                    height="24px"
                    justifyContent="center"
                    alignItems="center"
                    marginRight="14px"
                  >
                    <SvgIcon
                      {...IconCamera}
                      width={24}
                      height={24}
                      fillColor="#ffffff"
                    />
                  </FlexContainer>
                  <PrimaryTextSpan
                    color="#ffffff"
                    fontSize="18px"
                    fontWeight="normal"
                  >
                    {t('Use camera')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </label>
            </MenuToUploadItem>
            <MenuToUploadItem>
              <label htmlFor={`fileWithoutCamera-${name}`}>
                <FlexContainer alignItems="center">
                  <FlexContainer
                    width="24px"
                    height="24px"
                    justifyContent="center"
                    alignItems="center"
                    marginRight="14px"
                  >
                    <SvgIcon
                      {...IconPhotos}
                      width={24}
                      height={24}
                      fillColor="#ffffff"
                    />
                  </FlexContainer>
                  <PrimaryTextSpan
                    color="#ffffff"
                    fontSize="18px"
                    fontWeight="normal"
                  >
                    {t('Photos')}
                  </PrimaryTextSpan>
                </FlexContainer>
              </label>
            </MenuToUploadItem>
          </MenuToUpload>
          <CancelButton
            padding="12px"
            type="button"
            width="100%"
            backgroundColor={Colors.NOTIFICATION_BG}
            onClick={() => setOpen(false)}
          >
            <PrimaryTextSpan color="#ffffff" fontWeight="bold" fontSize="16px">
              {t('Cancel')}
            </PrimaryTextSpan>
          </CancelButton>
        </FlexContainer>
      )}
    </>
  );
};

export default InputPhoto;

const PhotoPreview = styled(FlexContainer)<{ photo: string }>`
  width: 48px;
  height: 48px;
  margin-right: 16px;
  border-radius: 4px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-color: rgba(255, 255, 255, 0.5);
  background-image: ${(props) => `url(${props.photo})`};
`;

const ClearImageButton = styled(ButtonWithoutStyles)`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.12);
  transition: background-color 0.4s ease;

  &:hover,
  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const InputLabel = styled(FlexContainer)<{ hasError: boolean }>`
  background-color: #252933;
  border-bottom: ${(props) => props.hasError && '2px solid #ED145B'};
`;
const InputLabelButton = styled(ButtonWithoutStyles)`
  width: 100%;
  margin-bottom: 24px;
`;

const CancelButton = styled(PrimaryButton)`
  &:hover {
    background-color: ${Colors.NOTIFICATION_BG};
  }
`;

const MenuToUpload = styled(FlexContainer)`
  background: ${Colors.NOTIFICATION_BG};
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0;
  margin-bottom: 16px;
  width: 100%;
  input[type='file'] {
    display: none;
  }
`;

const MenuToUploadItem = styled(FlexContainer)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 62px;
  padding: 8px 16px;
  text-decoration: none;
  margin-bottom: 1px;
  label {
    width: 100%;
  }
  &:hover {
    text-decoration: none;
  }
  &::first-of-type {
    border-bottom: 1px solid ${Colors.DARK_BLACK};
  }
`;
