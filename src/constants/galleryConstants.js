export const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/jpg',
];

export const GALLERY_PROCESS_BATCH_SIZE = 160;
export const GRID_INITIAL_RENDER_COUNT = 60;
export const GRID_RENDER_STEP = 40;
export const SESSION_HISTORY_KEY = 'visionfolder:tab-history:v1';
export const MAX_HISTORY_TABS = 20;

export const UI_MESSAGES = {
  appTitle: 'VisionFolder',
  appSubtitle: 'Visualize imagens locais com navegação rápida e consumo de memória controlado.',
  tabBarLabel: 'Pastas abertas',
  addFolder: 'Nova aba',
  countLabel: 'imagens carregadas',
  renderCountLabel: 'miniaturas visíveis',
  noTabTitle: 'Nenhuma pasta aberta',
  noTabDescription:
    'Abra a primeira pasta pela barra superior para iniciar a galeria.',
  emptyTitle: 'Nenhuma imagem válida encontrada',
  emptyDescription:
    'A pasta foi carregada, mas não há arquivos com extensões suportadas (.jpg, .jpeg, .png, .webp, .gif).',
  historyTitle: 'Histórico restaurado',
  historyDescription:
    'Esta aba veio do histórico da sessão. Clique na aba para selecionar a pasta novamente.',
  loading: 'Processando imagens da pasta...',
  loadingFallback: 'Preparando galeria...',
  loadingModal: 'Carregando imagem...',
  loadingThumb: 'Carregando miniatura...',
  loadingTab: 'carregando',
  historyTab: 'histórico',
  emptyTab: 'vazia',
  processingError:
    'Não foi possível processar esta pasta. Tente novamente com outra seleção.',
  tabCloseAria: 'Fechar aba',
  modalError: 'Falha ao carregar esta imagem.',
};
