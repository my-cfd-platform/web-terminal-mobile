import React, { FC, useEffect } from 'react';
import { FlexContainer, FlexContainerProps } from '../styles/FlexContainer';

interface Props {}

const AuthorizedContainer: FC<Props> = (props) => {
  const { children } = props;

  return <FlexContainer>{children}</FlexContainer>;
};
export default AuthorizedContainer;
