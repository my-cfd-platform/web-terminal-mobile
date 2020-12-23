import styled from '@emotion/styled';

export interface FlexContainerProps {
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | '';
  flexDirection?: 'column' | 'row';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  flexWrap?: 'wrap' | 'nowrap';
  width?: string;
  height?: string;
  minHeight?: string;
  minWidth?: string;
  maxHeight?: string;
  maxWidth?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  textColor?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static';
  top?: string;
  bottom?: string;
  right?: string;
  left?: string;
  zIndex?: string;
  overflow?: 'hidden' | 'visible' | 'auto';
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  marginRight?: string;
  marginBottom?: string;
  hasError?: boolean;
  flex?: string;
  opacity?: string;
  order?: string;
  backgroundImage?: string;
  transition?: string;
}

export const FlexContainer = styled.div<FlexContainerProps>`

  display: flex;
  flex: ${(props) => props.flex};
  position: ${(props) => props.position};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  min-height: ${(props) => props.minHeight};
  min-width: ${(props) => props.minWidth};
  max-height: ${(props) => props.maxHeight};
  max-width: ${(props) => props.maxWidth};
  padding: ${(props) => props.padding};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom};
  margin: ${(props) => props.margin};
  flex-wrap: ${(props) => props.flexWrap};
  flex-direction: ${(props) => props.flexDirection};
  background-color: ${(props) => props.backgroundColor};
  background-image: ${(props) => props.backgroundImage};
  color: ${(props) => props.textColor};
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left};
  z-index: ${(props) => props.zIndex};
  overflow: ${(props) => props.overflow};
  border-radius: ${(props) => props.borderRadius};
  border: ${(props) => props.border};
  box-shadow: ${(props) => props.boxShadow};
  opacity: ${(props) => props.opacity};
  order: ${(props) => props.order};
  transition: ${(props) => props.transition};
`;
