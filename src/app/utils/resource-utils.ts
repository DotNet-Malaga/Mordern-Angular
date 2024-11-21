import { ResourceLoader } from '@angular/core';

export function wait(
  msec: number,
  signal: AbortSignal | undefined = undefined
) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timeoutId = setTimeout(() => {
      resolve();
    }, msec);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export function debounce<T, U>(
  loader: ResourceLoader<T, U>,
  time = 300
): ResourceLoader<T, U> {
  return async param => {
    await wait(time, param.abortSignal);
    return await loader(param);
  };
}
