export function createPreviewUrl(file) {
  return URL.createObjectURL(file);
}

export function revokePreviewUrl(previewUrl) {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
}