import Resizer from 'react-image-file-resizer';

export function delay(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const resizeFile = (image: Blob) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      100,
      100,
      'PNG',
      70,
      0,
      (uri) => {
        resolve(uri);
      },
      'blob'
    );
  });
