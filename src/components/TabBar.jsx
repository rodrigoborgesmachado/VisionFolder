import { useRef } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { UI_MESSAGES } from '../constants/galleryConstants';
import './TabBar.css';

function getTabMeta(tab) {
  if (tab.status === 'loading') {
    return UI_MESSAGES.loadingTab;
  }

  if (tab.status === 'history') {
    return UI_MESSAGES.historyTab;
  }

  if (tab.status === 'empty') {
    return UI_MESSAGES.emptyTab;
  }

  return `${tab.totalImages}`;
}

function TabBar({
  tabs,
  activeTabId,
  acceptedExtensions,
  onAddFolder,
  onReconnectTab,
  onSelectTab,
  onCloseTab,
}) {
  const inputRef = useRef(null);
  const pendingTabIdRef = useRef(null);

  const openFolderPicker = (tabId = null) => {
    pendingTabIdRef.current = tabId;
    inputRef.current?.click();
  };

  const handleChange = (event) => {
    const selectedFiles = event.target.files;
    const targetTabId = pendingTabIdRef.current;
    pendingTabIdRef.current = null;

    if (targetTabId) {
      onReconnectTab(targetTabId, selectedFiles);
    } else {
      onAddFolder(selectedFiles);
    }

    event.target.value = '';
  };

  return (
    <section className="vf-tabbar">
      <div className="vf-tabbar__scroll" role="tablist" aria-label={UI_MESSAGES.tabBarLabel}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <article key={tab.id} className={`vf-tab ${isActive ? 'is-active' : ''}`}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className="vf-tab__select"
                onClick={() => {
                  onSelectTab(tab.id);

                  if (tab.status === 'history') {
                    openFolderPicker(tab.id);
                  }
                }}
              >
                <span className="vf-tab__name" title={tab.name}>
                  {tab.name}
                </span>
                <small className="vf-tab__meta">{getTabMeta(tab)}</small>
              </button>

              <button
                type="button"
                className="vf-tab__close"
                aria-label={`${UI_MESSAGES.tabCloseAria}: ${tab.name}`}
                onClick={() => onCloseTab(tab.id)}
              >
                <FiX size={14} />
              </button>
            </article>
          );
        })}

        <button
          type="button"
          className="vf-tab vf-tab--add"
          onClick={openFolderPicker}
          aria-label={UI_MESSAGES.addFolder}
          title={UI_MESSAGES.addFolder}
        >
          <FiPlus size={17} />
        </button>
      </div>

      <input
        ref={inputRef}
        className="vf-tabbar__input"
        type="file"
        multiple
        accept={acceptedExtensions.join(',')}
        onChange={handleChange}
        webkitdirectory=""
        directory=""
        mozdirectory=""
      />
    </section>
  );
}

export default TabBar;
