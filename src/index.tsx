import React, { FC } from 'react';
import deepmerge from 'deepmerge';

type Props<T> = {
  value: T;
  children: React.ReactNode;
  mergeType?: MergeType;
};

export enum MergeType {
  Merge,
  Replace,
}

export const createContext = <T,>(): [FC<Props<T>>, () => T] => {
  const Context = React.createContext<T | undefined>(undefined);
  const useContext = () => React.useContext(Context) as T;

  const Provider: FC<Props<T>> = (props: Props<T>) => {
    const { children, value, mergeType = MergeType.Merge } = props;
    const result = applyMerge(value, useContext(), mergeType);
    return <Context.Provider value={result}>{children}</Context.Provider>;
  };
  return [Provider, useContext];
};

function applyMerge<T>(value: T, parentValue: T, type: MergeType) {
  if (!parentValue || type === MergeType.Replace) {
    return value;
  }
  return deepmerge<T>(parentValue, value);
}
