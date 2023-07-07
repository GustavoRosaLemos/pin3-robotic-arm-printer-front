export interface Configuration {
  files: FileList | null;
  algorithm: string[];
  colorChangeDelay: number;
  moveDelay: number;
  imageMaxSize: number;
  renderQuantity: number;
}

export interface ImageData {
  alg: string;
  matrix: number[][];
  matrixOrder: number[][];
  time: number;
  timeMove: number;
  timeChange: number;
}

export interface MatrixData {
  matrix: number[][];
  algorithm: string[];
  timeChange: number;
  timeMove: number;
  renderQuantity: number;
}

export interface Options {
  value: string;
  label: string;
}
