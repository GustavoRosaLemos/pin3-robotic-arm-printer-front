import { MatrixData } from '../../shared/@types';
import { requestService } from '../../utils/requestService';

export const requestPostRenderImage = async (matrix: MatrixData) => {
  const url = '';
  const body = {
    image: matrix,
  };
  const headers = {
    'content-type': 'application/json',
  };

  return requestService(url, body, headers, false, 'POST');
};
