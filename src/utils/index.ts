import Resizer from 'react-image-file-resizer';
import { saveAs } from 'file-saver';

export function delay(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const resizeFile = (image: Blob, maxSize: number) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      maxSize,
      maxSize,
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

export function formatRemainingTime(seconds: number): string {
  let minutes: number = Math.floor(seconds / 60);
  seconds %= 60;
  let hours: number = Math.floor(minutes / 60);
  minutes %= 60;
  const days: number = Math.floor(hours / 24);
  hours %= 24;

  let remainingTime: string = '';

  if (days > 0) {
    remainingTime += `${days} dia(s) `;
  }
  if (hours > 0) {
    remainingTime += `${hours} hora(s) `;
  }
  if (minutes > 0) {
    remainingTime += `${minutes} minuto(s) `;
  }

  return remainingTime.trim();
}
