import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { UI_MESSAGES } from '../constants/galleryConstants';
import { useObjectUrl } from '../hooks/useObjectUrl';
import './ImageViewerModal.css';

function ImageViewerModal({
  image,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  positionLabel,
}) {
  const previewUrl = useObjectUrl(image?.file);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setIsImageLoading(true);
    setHasImageError(false);
  }, [previewUrl, image?.id]);

  if (!isOpen || !image) {
    return null;
  }

  return (
    <div className="vf-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="vf-modal__content" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="vf-modal__close"
          onClick={onClose}
          aria-label="Fechar visualizador"
        >
          <FiX size={22} />
        </button>

        <button
          type="button"
          className="vf-modal__nav vf-modal__nav--left"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-label="Imagem anterior"
        >
          <FiChevronLeft size={26} />
        </button>

        <figure className="vf-modal__figure">
          <div className="vf-modal__image-wrap">
            {previewUrl && (
              <img
                src={previewUrl}
                alt={image.name}
                decoding="async"
                className={isImageLoading ? 'is-hidden' : ''}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false);
                  setHasImageError(true);
                }}
              />
            )}

            {(isImageLoading || !previewUrl) && (
              <div className="vf-modal__loading">{UI_MESSAGES.loadingModal}</div>
            )}

            {hasImageError && (
              <div className="vf-modal__loading vf-modal__loading--error">
                {UI_MESSAGES.modalError}
              </div>
            )}
          </div>

          <figcaption>
            <span title={image.relativePath}>{image.relativePath}</span>
            <strong>{positionLabel}</strong>
          </figcaption>
        </figure>

        <button
          type="button"
          className="vf-modal__nav vf-modal__nav--right"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Próxima imagem"
        >
          <FiChevronRight size={26} />
        </button>
      </div>
    </div>
  );
}

export default ImageViewerModal;
