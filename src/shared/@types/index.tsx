export interface Configuration {
  files: FileList | null;
  algorithm: number;
  colorChangeDelay: number;
  moveDelay: number;
}

export interface ImageData {
  matrix: number[][];
  matrixOrder: number[][];
  time: number;
  timeMove: number;
  timeChange: number;
}

export interface MatrixData {
  matrix: number[][];
  algorithm: number;
  timeChange: number;
  timeMove: number;
}
