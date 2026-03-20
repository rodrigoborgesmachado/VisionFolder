import EmptyState from '../components/EmptyState';
import Header from '../components/Header';
import ImageGrid from '../components/ImageGrid';
import ImageViewerModal from '../components/ImageViewerModal';
import LoadingState from '../components/LoadingState';
import TabBar from '../components/TabBar';
import { ACCEPTED_IMAGE_EXTENSIONS, UI_MESSAGES } from '../constants/galleryConstants';
import { useGallery } from '../hooks/useGallery';
import { useModalKeyboard } from '../hooks/useModalKeyboard';
import './HomePage.css';

function HomePage() {
  const {
    tabs,
    activeTab,
    activeTabId,
    activeImages,
    hasTabs,
    isLoading,
    feedback,
    activeIndex,
    currentImage,
    isViewerOpen,
    loadingProgress,
    canGoPrevious,
    canGoNext,
    addFolderAsTab,
    reconnectHistoryTab,
    switchTab,
    closeTab,
    openImage,
    closeViewer,
    goToPrevious,
    goToNext,
  } = useGallery();

  useModalKeyboard({
    isOpen: isViewerOpen,
    onClose: closeViewer,
    onPrevious: goToPrevious,
    onNext: goToNext,
    canGoPrevious,
    canGoNext,
  });

  const positionLabel = isViewerOpen ? `${activeIndex + 1} de ${activeImages.length}` : '';

  const loadingLabel =
    loadingProgress.total > 0
      ? `${UI_MESSAGES.loading} (${loadingProgress.processed}/${loadingProgress.total})`
      : UI_MESSAGES.loadingFallback;

  const activeTabHasImages = activeTab?.status === 'ready' && activeImages.length > 0;
  const shouldShowMeta = hasTabs && activeTab?.status !== 'loading';

  const emptyStateConfig = !hasTabs
    ? {
        title: UI_MESSAGES.noTabTitle,
        description: UI_MESSAGES.noTabDescription,
      }
    : activeTab?.status === 'history'
      ? {
          title: UI_MESSAGES.historyTitle,
          description: UI_MESSAGES.historyDescription,
        }
      : {
          title: UI_MESSAGES.emptyTitle,
          description: feedback || UI_MESSAGES.emptyDescription,
        };

  return (
    <main className="vf-home-page">
      <div className="vf-home-page__shell">
        <Header title={UI_MESSAGES.appTitle} subtitle={UI_MESSAGES.appSubtitle} />

        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          acceptedExtensions={ACCEPTED_IMAGE_EXTENSIONS}
          onAddFolder={addFolderAsTab}
          onReconnectTab={reconnectHistoryTab}
          onSelectTab={switchTab}
          onCloseTab={closeTab}
        />

        <section className="vf-home-page__workspace">
          {shouldShowMeta && (
            <section className="vf-home-page__meta" aria-live="polite">
              <strong>{activeImages.length}</strong>
              <span>{UI_MESSAGES.countLabel}</span>
            </section>
          )}

          {isLoading && <LoadingState message={loadingLabel} />}

          {!isLoading && !activeTabHasImages && (
            <EmptyState title={emptyStateConfig.title} description={emptyStateConfig.description} />
          )}

          {activeTabHasImages && !isViewerOpen && (
            <ImageGrid images={activeImages} onOpenImage={openImage} />
          )}
        </section>

        <ImageViewerModal
          image={currentImage}
          isOpen={isViewerOpen}
          onClose={closeViewer}
          onPrevious={goToPrevious}
          onNext={goToNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          positionLabel={positionLabel}
        />
      </div>
    </main>
  );
}

export default HomePage;
