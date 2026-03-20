import { useEffect, useMemo, useRef, useState } from 'react';
import {
  GRID_INITIAL_RENDER_COUNT,
  GRID_RENDER_STEP,
  UI_MESSAGES,
} from '../constants/galleryConstants';
import ImageCard from './ImageCard';
import './ImageGrid.css';

function ImageGrid({ images, onOpenImage }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(Math.min(images.length, GRID_INITIAL_RENDER_COUNT));
  }, [images]);

  useEffect(() => {
    if (visibleCount >= images.length) {
      return;
    }

    const sentinelNode = sentinelRef.current;
    if (!sentinelNode) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        setVisibleCount((current) => Math.min(current + GRID_RENDER_STEP, images.length));
      },
      {
        rootMargin: '250px 0px',
      },
    );

    observer.observe(sentinelNode);

    return () => {
      observer.disconnect();
    };
  }, [images.length, visibleCount]);

  const visibleImages = useMemo(() => images.slice(0, visibleCount), [images, visibleCount]);

  return (
    <section className="vf-image-grid-wrap" aria-label="Galeria de imagens">
      <div className="vf-image-grid">
        {visibleImages.map((image, index) => (
          <ImageCard key={image.id} image={image} onClick={() => onOpenImage(index)} />
        ))}
      </div>

      {images.length > 0 && (
        <footer className="vf-image-grid__footer">
          <span>
            {visibleCount} / {images.length} {UI_MESSAGES.renderCountLabel}
          </span>
        </footer>
      )}

      {visibleCount < images.length && (
        <div className="vf-image-grid__sentinel" ref={sentinelRef} aria-hidden="true" />
      )}
    </section>
  );
}

export default ImageGrid;