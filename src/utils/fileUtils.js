import { ACCEPTED_IMAGE_EXTENSIONS, ACCEPTED_IMAGE_TYPES } from '../constants/galleryConstants';

export function getFileExtension(fileName = '') {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex < 0) {
    return '';
  }

  return fileName.slice(dotIndex).toLowerCase();
}

export function isSupportedImageFile(file) {
  if (!file) {
    return false;
  }

  const extension = getFileExtension(file.name);
  const hasValidExtension = ACCEPTED_IMAGE_EXTENSIONS.includes(extension);
  const hasValidMimeType = ACCEPTED_IMAGE_TYPES.includes((file.type || '').toLowerCase());

  return hasValidExtension || hasValidMimeType;
}

export function filterImageFiles(files = []) {
  return files.filter(isSupportedImageFile);
}

export function sortFilesByName(files = []) {
  return [...files].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', {
      sensitivity: 'base',
      numeric: true,
    }),
  );
}

export function getRelativePath(file) {
  return file.webkitRelativePath || file.name;
}

export function getFolderNameFromFileList(fileList) {
  const files = Array.from(fileList || []);
  const firstFile = files[0];

  if (!firstFile) {
    return 'Pasta sem nome';
  }

  const relativePath = firstFile.webkitRelativePath || '';
  if (!relativePath) {
    return 'Pasta local';
  }

  const [folderName] = relativePath.split(/[\\/]/);
  return folderName || 'Pasta local';
}

export function mapFilesToGalleryItems(files = []) {
  return files.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    name: file.name,
    relativePath: getRelativePath(file),
    size: file.size,
    lastModified: file.lastModified,
    file,
  }));
}
