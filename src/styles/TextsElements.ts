import styled from '@emotion/styled';

interface PrimaryTextType {
  color?: string;
  fontWeight?: 'bold' | 'normal' | number;
  fontStyle?: 'italic' | 'normal';
  fontSize?:
    | '8px'
    | '12px'
    | '11px'
    | '13px'
    | '14px'
    | '16px'
    | '10px'
    | '20px'
    | '24px'
    | '30px';
  lineHeight?: string;
  marginRight?: string;
  marginBottom?: string;
  textDecoration?: 'underline';
  textTransform?: 'capitalize' | 'lowercase' | 'uppercase';
  whiteSpace?: 'nowrap' | 'pre' | 'normal';
  textAlign?: 'left' | 'center' | 'right';
  textOverflow?: 'ellipsis';
  overflow?: 'hidden';
  width?: string;
}

export const PrimaryTextSpan = styled.span<PrimaryTextType>`
  font-style: ${(props) => props.fontStyle};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  font-size: ${(props) => props.fontSize || '14px'};
  line-height: ${(props) => props.lineHeight || '120%'};
  color: ${(props) => props.color || '#FFFCCC'};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom};
  text-decoration: ${(props) => props.textDecoration};
  text-transform: ${(props) => props.textTransform};
  white-space: ${(props) => props.whiteSpace};
  text-align: ${(props) => props.textAlign};
  text-overflow: ${(props) => props.textOverflow};
  overflow: ${(props) => props.overflow};
`;

export const PrimaryTextParagraph = styled.p<PrimaryTextType>`
  font-style: ${(props) => props.fontStyle};
  font-weight: ${(props) => props.fontWeight};
  font-size: ${(props) => props.fontSize || '16px'};
  line-height: ${(props) => props.lineHeight || '120%'};
  color: ${(props) => props.color || '#FFFCCC'};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom || '0'};
  text-decoration: ${(props) => props.textDecoration};
  text-transform: ${(props) => props.textTransform};
  white-space: ${(props) => props.whiteSpace};
  text-align: ${(props) => props.textAlign};
  text-overflow: ${(props) => props.textOverflow};
  overflow: ${(props) => props.overflow};
  width: ${(props) => props.width};
`;

export const QuoteText = styled(PrimaryTextSpan)<
  PrimaryTextType & { isGrowth?: boolean }
>`
  font-family: 'Roboto', sans-serif;
  font-style: ${(props) => props.fontStyle || 'normal'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  font-size: ${(props) => props.fontSize || '16px'};
  line-height: ${(props) => props.lineHeight || '120%'};
  color: ${(props) => (props.isGrowth ? '#3BFF8A' : '#FF557E')};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom};
  text-decoration: ${(props) => props.textDecoration};
  text-transform: ${(props) => props.textTransform};
  text-align: ${(props) => props.textAlign};
  text-overflow: ${(props) => props.textOverflow};
  overflow: ${(props) => props.overflow};
`;
