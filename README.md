# VisionFolder

Aplicação web em React para visualizar imagens locais por pasta, com galerias em abas, modal com navegação e foco em baixo consumo de memória.

## Objetivo

O VisionFolder permite:
- abrir uma pasta local no navegador
- filtrar apenas imagens válidas (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`)
- exibir miniaturas em grid responsivo com lazy loading real
- abrir imagem em modal com loading, teclado e navegação anterior/próxima
- manter histórico de abas na sessão atual

## Tecnologias

- React + Vite
- JavaScript (sem TypeScript)
- CSS por componente/página
- react-icons

## Como instalar

```bash
npm install
```

## Como rodar

```bash
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```text
src/
  components/
    EmptyState.jsx
    Header.jsx
    ImageCard.jsx
    ImageGrid.jsx
    ImageViewerModal.jsx
    LoadingState.jsx
    TabBar.jsx
  constants/
    galleryConstants.js
  hooks/
    useGallery.js
    useModalKeyboard.js
    useObjectUrl.js
  pages/
    HomePage.jsx
  services/
    folderService.js
  styles/
    globals.css
  utils/
    fileUtils.js
    imageUtils.js
  App.jsx
  main.jsx
```

## Leitura da pasta (frontend puro)

O app usa `input type="file"` com `webkitdirectory` para o usuário selecionar uma pasta local.

Fluxo:
1. seleciona pasta
2. browser entrega `FileList`
3. o app processa em lotes e filtra formatos válidos
4. salva referências dos arquivos da aba ativa
5. gera `ObjectURL` sob demanda (thumb/modal)
6. revoga URLs ao desmontar para reduzir memória

## Abas e histórico de sessão

- Cada pasta aberta vira uma aba.
- A aba ativa exibe a galeria.
- Abas ocultas não mantêm miniaturas renderizadas nem URLs ativas.
- O histórico de abas é salvo em `sessionStorage`.

## Limitações importantes

- `webkitdirectory` depende de suporte do navegador.
- `sessionStorage` não consegue persistir objetos `File`; por isso, ao reabrir a aplicação, as abas voltam como histórico e precisam ser reabertas para carregar imagens novamente.
- Pastas muito grandes podem levar tempo de processamento, mas o app exibe progresso.

## Evoluções futuras

- filtro por nome
- ordenação por nome/data
- slideshow
- zoom
- fullscreen
- favoritos
- suporte a vídeo
