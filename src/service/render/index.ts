import { MatrixData } from '../../shared/@types';
import { requestService } from '../../utils/requestService';

export const requestPostRenderImage = async (matrix: MatrixData) => {
  const url = `http://127.0.0.1:8080/print/${matrix.algorithm}`;
  const headers = {
    'content-type': 'application/json',
  };

  return requestService(url, matrix, headers, false, 'POST');
};

export const requestPostMultipleRenderImage = async (matrix: MatrixData) => {
  const url = `http://127.0.0.1:8080/print/all?alg1=${
    matrix.algorithm.find((algh) => algh === '1') ? matrix.renderQuantity : 0
  }&alg2=${
    matrix.algorithm.find((algh) => algh === '2') ? matrix.renderQuantity : 0
  }&alg3=${
    matrix.algorithm.find((algh) => algh === '3') ? matrix.renderQuantity : 0
  }`;
  const headers = {
    'content-type': 'application/json',
  };

  return requestService(url, matrix, headers, false, 'POST');
};
