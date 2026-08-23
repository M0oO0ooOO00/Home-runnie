declare module 'react-simple-pull-to-refresh' {
  import type { FC, ReactElement } from 'react';

  export interface PullToRefreshProps {
    isPullable?: boolean;
    canFetchMore?: boolean;
    onRefresh: () => Promise<unknown>;
    onFetchMore?: () => Promise<unknown>;
    refreshingContent?: ReactElement | string;
    pullingContent?: ReactElement | string;
    children: ReactElement;
    pullDownThreshold?: number;
    fetchMoreThreshold?: number;
    maxPullDownDistance?: number;
    resistance?: number;
    backgroundColor?: string;
    className?: string;
  }

  const PullToRefresh: FC<PullToRefreshProps>;
  export default PullToRefresh;
}
