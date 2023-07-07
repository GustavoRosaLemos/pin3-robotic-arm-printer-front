interface ColorMap {
  [key: string]: number[];
}

export function reduceImageColors(imageData: ImageData): {
  newImageData: ImageData;
  colorMap: ColorMap;
} {
  const { data, width, height } = imageData;
  const colorValues = [
    0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240,

    255,
  ];
  const colorMap: ColorMap = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${r},${g},${b}`;

    const newR = findClosestValue(r, colorValues);
    const newG = findClosestValue(g, colorValues);
    const newB = findClosestValue(b, colorValues);

    if (!colorMap[key]) {
      colorMap[key] = [newR, newG, newB];
    }

    data[i] = newR;
    data[i + 1] = newG;
    data[i + 2] = newB;
  }

  const newImageData = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height
  );

  return { newImageData, colorMap };
}

export function limitColorVariations(
  imageData: ImageData,
  step: number
): ImageData {
  const { data, width, height } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step; // red
    data[i + 1] = Math.round(data[i + 1] / step) * step; // green
    data[i + 2] = Math.round(data[i + 2] / step) * step; // blue
  }

  return new ImageData(data, width, height);
}

function findClosestValue(value: number, array: number[]): number {
  return array.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}
