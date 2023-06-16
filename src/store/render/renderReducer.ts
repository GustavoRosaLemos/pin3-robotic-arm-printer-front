import { ImageData, MatrixData } from '../../shared/@types';
import * as renderActions from './renderAction';

export interface State {
  matrixData?: MatrixData;
  image?: ImageData;
}

const INITIAL_STATE: State = {
  matrixData: undefined,
  image: undefined,
};

export type Actions = renderActions.GetMatrixData | renderActions.GetImage;

// eslint-disable-next-line default-param-last
export const renderReducer = (state = INITIAL_STATE, action: Actions) => {
  switch (action.type) {
    case renderActions.GET_MATRIX: {
      const { matrixData } = action.payload;
      return {
        ...state,
        matrixData,
      };
    }
    case renderActions.GET_IMAGE: {
      const { image } = action.payload;
      return {
        ...state,
        image,
      };
    }
    default:
      return {
        ...state,
      };
  }
};
