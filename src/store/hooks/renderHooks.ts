import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../reducers';
import * as renderActions from '../render/renderAction';
import {
  requestPostMultipleRenderImage,
  requestPostRenderImage,
} from '../../service/render';
import { MatrixData } from '../../shared/@types';

const useRenderState = () =>
  useSelector((rootState: RootState) => rootState.renderState);

export const useMatrixData = () => useRenderState().matrixData;

export const useGetMatrixData = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (matrixData: MatrixData) => {
      dispatch(renderActions.getMatrixData(matrixData));
    },
    [dispatch]
  );
};

export const useImage = () => useRenderState().image;

export const useGetImage = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (matrixData: MatrixData) => {
      const image = await requestPostRenderImage(matrixData);
      dispatch(renderActions.getImage(image));
    },
    [dispatch]
  );
};

export const useMultipleImage = () => useRenderState().multipleImage;

export const useGetMultipleImage = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (matrixData: MatrixData) => {
      const multipleImage = await requestPostMultipleRenderImage(matrixData);
      dispatch(renderActions.getMultipleImage(multipleImage));
    },
    [dispatch]
  );
};
