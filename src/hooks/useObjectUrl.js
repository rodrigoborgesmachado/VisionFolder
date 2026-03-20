import { useEffect, useState } from 'react';
import { createPreviewUrl, revokePreviewUrl } from '../utils/imageUtils';

export function useObjectUrl(file) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }

    const nextPreviewUrl = createPreviewUrl(file);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      revokePreviewUrl(nextPreviewUrl);
    };
  }, [file]);

  return previewUrl;
}