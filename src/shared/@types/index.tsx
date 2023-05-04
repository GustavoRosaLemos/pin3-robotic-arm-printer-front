export interface Configuration {
  files: FileList | null;
  algorithm: string;
  colorChangeDelay: number;
  moveDelay: number;
}

export interface ImageData {
  image: number[][];
  time: number;
  moves: number;
  colorChanges: number;
  timeMove: number;
  timeChange: number;
}

export interface MatrixData {
  matrix: number[][];
  algorithm: string;
  colorChangeDelay: number;
  moveDelay: number;
}
