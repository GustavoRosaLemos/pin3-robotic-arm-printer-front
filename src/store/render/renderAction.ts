import { ImageData, MatrixData } from '../../shared/@types';

export const GET_MATRIX = 'GET_MATRIX';
export const GET_IMAGE = 'GET_IMAGE';

export const getMatrixData = (matrixData: MatrixData) => ({
  type: GET_MATRIX,
  payload: {
    matrixData,
  },
});

export interface GetMatrixData {
  type: typeof GET_MATRIX;
  payload: {
    matrixData: MatrixData;
  };
}

export const getImage = (image: ImageData) => ({
  type: GET_IMAGE,
  payload: {
    image,
  },
});

export interface GetImage {
  type: typeof GET_IMAGE;
  payload: {
    image: ImageData;
  };
}
