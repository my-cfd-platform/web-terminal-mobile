import React, { useEffect, FC, useRef, useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  listData: any[];
  getData: (arg0: boolean) => void;
  isFetching: boolean;
  noMoreData: boolean;
}

// list should have fixed height
const InfinityScrollList: FC<Props> = ({
  children,
  getData,
  listData,
  isFetching,
  noMoreData,
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(
    entries => {
      const target = entries[0];
      if (target.isIntersecting && !noMoreData) {
        !isFetching && getData(true);
      }
    },
    [isFetching, listData]
  );

  useEffect(() => {
    const options = {
      root: null, // window by default
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef, loadMore]);
  return (
    <>
      {children}
      <FlexContainer minHeight={'70px'} ref={loaderRef}></FlexContainer>
    </>
  );
};

export default InfinityScrollList;
