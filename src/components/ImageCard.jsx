import { useObjectUrl } from '../hooks/useObjectUrl';
import { UI_MESSAGES } from '../constants/galleryConstants';
import './ImageCard.css';

function ImageCard({ image, onClick }) {
  const previewUrl = useObjectUrl(image.file);

  return (
    <button type="button" className="vf-image-card" onClick={onClick}>
      {previewUrl ? (
        <img src={previewUrl} alt={image.name} loading="lazy" decoding="async" />
      ) : (
        <div className="vf-image-card__placeholder">{UI_MESSAGES.loadingThumb}</div>
      )}
      <span title={image.relativePath}>{image.relativePath}</span>
    </button>
  );
}

export default ImageCard;
