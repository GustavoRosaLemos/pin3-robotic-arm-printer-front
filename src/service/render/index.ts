import { MatrixData } from '../../shared/@types';
import { requestService } from '../../utils/requestService';

export const requestPostRenderImage = async (matrix: MatrixData) => {
  const url = `http://127.0.0.1:8080/print/${matrix.algorithm}`;
  const headers = {
    'content-type': 'application/json',
  };

  return requestService(url, matrix, headers, false, 'POST');
};
