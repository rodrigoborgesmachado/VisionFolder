import { useEffect } from 'react';

export function useModalKeyboard({ isOpen, onClose, onPrevious, onNext, canGoPrevious, canGoNext }) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft' && canGoPrevious) {
        onPrevious();
      }

      if (event.key === 'ArrowRight' && canGoNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canGoNext, canGoPrevious, isOpen, onClose, onNext, onPrevious]);
}
