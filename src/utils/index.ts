import Resizer from 'react-image-file-resizer';
import { saveAs } from 'file-saver';

export function delay(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const resizeFile = (image: Blob) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      120,
      120,
      'PNG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'blob'
    );
  });

export const saveJSONInFile = (json: object, fileName: string) => {
  const jsonText = JSON.stringify(json);
  const blob = new Blob([jsonText], { type: 'application/json' });
  saveAs(blob, fileName);
};
