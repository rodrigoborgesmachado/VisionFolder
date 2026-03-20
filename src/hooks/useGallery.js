import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GALLERY_PROCESS_BATCH_SIZE,
  MAX_HISTORY_TABS,
  SESSION_HISTORY_KEY,
  UI_MESSAGES,
} from '../constants/galleryConstants';
import { buildGalleryFromFileList } from '../services/folderService';
import { getFolderNameFromFileList, mapFilesToGalleryItems } from '../utils/fileUtils';

const EMPTY_PROGRESS = {
  processed: 0,
  total: 0,
  foundImages: 0,
};

function createTabId() {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toSerializableTabs(tabs) {
  return tabs.slice(0, MAX_HISTORY_TABS).map((tab) => ({
    id: tab.id,
    name: tab.name,
    status: tab.status === 'history' ? 'history' : 'ready',
    totalFiles: tab.totalFiles,
    totalImages: tab.totalImages,
    updatedAt: tab.updatedAt,
  }));
}

function restoreTabsFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_HISTORY_KEY);
    if (!raw) {
      return {
        tabs: [],
        activeTabId: null,
      };
    }

    const parsed = JSON.parse(raw);
    const serializedTabs = Array.isArray(parsed?.tabs) ? parsed.tabs : [];

    const tabs = serializedTabs.slice(0, MAX_HISTORY_TABS).map((tab) => ({
      id: tab.id || createTabId(),
      name: tab.name || 'Pasta local',
      status: 'history',
      totalFiles: Number(tab.totalFiles) || 0,
      totalImages: Number(tab.totalImages) || 0,
      imageFiles: [],
      feedback: '',
      loadingProgress: EMPTY_PROGRESS,
      updatedAt: Number(tab.updatedAt) || Date.now(),
    }));

    const activeTabId =
      tabs.find((tab) => tab.id === parsed?.activeTabId)?.id ?? tabs[0]?.id ?? null;

    return { tabs, activeTabId };
  } catch {
    return {
      tabs: [],
      activeTabId: null,
    };
  }
}

function persistTabsToSession(tabs, activeTabId) {
  const payload = {
    activeTabId,
    tabs: toSerializableTabs(tabs),
  };

  sessionStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(payload));
}

function createLoadingTab({ id, name }) {
  return {
    id,
    name,
    status: 'loading',
    totalFiles: 0,
    totalImages: 0,
    imageFiles: [],
    feedback: '',
    loadingProgress: EMPTY_PROGRESS,
    updatedAt: Date.now(),
  };
}

export function useGallery() {
  const restoredState = useMemo(() => restoreTabsFromSession(), []);
  const [tabs, setTabs] = useState(restoredState.tabs);
  const [activeTabId, setActiveTabId] = useState(restoredState.activeTabId);
  const [activeIndex, setActiveIndex] = useState(-1);

  const tabLoadTokenRef = useRef(new Map());

  useEffect(() => {
    persistTabsToSession(tabs, activeTabId);
  }, [tabs, activeTabId]);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? null,
    [tabs, activeTabId],
  );

  const activeImages = useMemo(
    () => mapFilesToGalleryItems(activeTab?.imageFiles || []),
    [activeTab?.id, activeTab?.imageFiles],
  );

  const isViewerOpen = activeIndex >= 0 && activeIndex < activeImages.length;
  const currentImage = isViewerOpen ? activeImages[activeIndex] : null;

  const processFileListForTab = useCallback(async ({ tabId, fileList }) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const tabName = getFolderNameFromFileList(fileList);
    const loadToken = Symbol(tabId);
    tabLoadTokenRef.current.set(tabId, loadToken);

    setActiveIndex(-1);
    setActiveTabId(tabId);
    setTabs((previousTabs) => {
      const tabExists = previousTabs.some((tab) => tab.id === tabId);

      if (tabExists) {
        return previousTabs.map((tab) =>
          tab.id === tabId ? createLoadingTab({ id: tabId, name: tabName }) : tab,
        );
      }

      return [...previousTabs, createLoadingTab({ id: tabId, name: tabName })];
    });

    try {
      const { imageFiles, totalFiles, totalImages } = await buildGalleryFromFileList(fileList, {
        batchSize: GALLERY_PROCESS_BATCH_SIZE,
        onProgress: ({ processed, total, foundImages }) => {
          if (tabLoadTokenRef.current.get(tabId) !== loadToken) {
            return;
          }

          setTabs((previousTabs) =>
            previousTabs.map((tab) =>
              tab.id === tabId
                ? {
                    ...tab,
                    loadingProgress: {
                      processed,
                      total,
                      foundImages,
                    },
                  }
                : tab,
            ),
          );
        },
      });

      if (tabLoadTokenRef.current.get(tabId) !== loadToken) {
        return;
      }

      setTabs((previousTabs) =>
        previousTabs.map((tab) => {
          if (tab.id !== tabId) {
            return tab;
          }

          const hasImages = totalImages > 0;

          return {
            ...tab,
            status: hasImages ? 'ready' : 'empty',
            totalFiles,
            totalImages,
            imageFiles,
            feedback: hasImages ? '' : UI_MESSAGES.emptyDescription,
            loadingProgress: {
              processed: totalFiles,
              total: totalFiles,
              foundImages: totalImages,
            },
            updatedAt: Date.now(),
          };
        }),
      );
    } catch (error) {
      if (tabLoadTokenRef.current.get(tabId) !== loadToken || error?.name === 'AbortError') {
        return;
      }

      setTabs((previousTabs) =>
        previousTabs.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                status: 'error',
                feedback: UI_MESSAGES.processingError,
                imageFiles: [],
                totalImages: 0,
                loadingProgress: EMPTY_PROGRESS,
                updatedAt: Date.now(),
              }
            : tab,
        ),
      );
    } finally {
      if (tabLoadTokenRef.current.get(tabId) === loadToken) {
        tabLoadTokenRef.current.delete(tabId);
      }
    }
  }, []);

  const addFolderAsTab = useCallback(async (fileList) => {
    const id = createTabId();
    await processFileListForTab({ tabId: id, fileList });
  }, [processFileListForTab]);

  const reconnectHistoryTab = useCallback(async (tabId, fileList) => {
    if (!tabId) {
      return;
    }

    await processFileListForTab({ tabId, fileList });
  }, [processFileListForTab]);

  const switchTab = useCallback((tabId) => {
    setActiveTabId(tabId);
    setActiveIndex(-1);
  }, []);

  const closeTab = useCallback((tabId) => {
    tabLoadTokenRef.current.delete(tabId);

    setTabs((previousTabs) => {
      const closingIndex = previousTabs.findIndex((tab) => tab.id === tabId);
      if (closingIndex < 0) {
        return previousTabs;
      }

      const nextTabs = previousTabs.filter((tab) => tab.id !== tabId);

      setActiveTabId((currentActiveId) => {
        if (currentActiveId !== tabId) {
          return currentActiveId;
        }

        const fallbackTab = nextTabs[closingIndex] || nextTabs[closingIndex - 1] || null;
        return fallbackTab?.id ?? null;
      });

      return nextTabs;
    });

    setActiveIndex(-1);
  }, []);

  const openImage = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const closeViewer = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current > 0 ? current - 1 : current));
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) =>
      current < activeImages.length - 1 ? current + 1 : current,
    );
  }, [activeImages.length]);

  return {
    tabs,
    activeTabId,
    activeTab,
    activeImages,
    hasTabs: tabs.length > 0,
    isLoading: activeTab?.status === 'loading',
    feedback: activeTab?.feedback || '',
    loadingProgress: activeTab?.loadingProgress || EMPTY_PROGRESS,
    activeIndex,
    currentImage,
    isViewerOpen,
    canGoPrevious: activeIndex > 0,
    canGoNext: activeIndex >= 0 && activeIndex < activeImages.length - 1,
    addFolderAsTab,
    reconnectHistoryTab,
    switchTab,
    closeTab,
    openImage,
    closeViewer,
    goToPrevious,
    goToNext,
  };
}
