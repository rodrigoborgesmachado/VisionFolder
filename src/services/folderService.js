import { isSupportedImageFile, sortFilesByName } from '../utils/fileUtils';

function createAbortError() {
  const error = new Error('Processing aborted');
  error.name = 'AbortError';
  return error;
}

function assertNotAborted(signal) {
  if (signal?.aborted) {
    throw createAbortError();
  }
}

function yieldToMainThread() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

export async function buildGalleryFromFileList(
  fileList,
  { batchSize = 160, onProgress, signal } = {},
) {
  const files = Array.from(fileList || []);
  const filteredImages = [];

  for (let start = 0; start < files.length; start += batchSize) {
    assertNotAborted(signal);

    const currentBatch = files.slice(start, start + batchSize);
    const validFiles = currentBatch.filter(isSupportedImageFile);
    filteredImages.push(...validFiles);

    const processed = Math.min(start + currentBatch.length, files.length);
    onProgress?.({
      processed,
      total: files.length,
      foundImages: filteredImages.length,
      totalFiles: files.length,
    });

    await yieldToMainThread();
  }

  const imageFiles = sortFilesByName(filteredImages);
  const totalImages = imageFiles.length;

  return {
    imageFiles,
    totalFiles: files.length,
    totalImages,
  };
}
