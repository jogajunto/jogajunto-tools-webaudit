# Changelog

## [0.1.0] - 2023-12-06

### Added

- **Helpers**

  - `addToExcel.ts/js`: Implementação de uma função para adicionar dados a uma planilha do Excel, com suporte para criação e atualização de arquivos.
  - `checkSpelling.ts`: Função de verificação ortográfica que suporta múltiplos idiomas, utilizando `nodehun`.
  - `pageSpeedTest.ts`: Função para avaliar performance de páginas web usando a API do PageSpeed, registrando métricas em Excel.
  - `preTestSetup.js`: Script para preparação de ambiente de testes, removendo arquivos com base em padrões definidos.
  - `toSlug.ts`: Funcionalidade para conversão de strings em slugs, removendo caracteres não alfanuméricos.

- **Utils**

  - `checkAccessibilityViolations.ts`: Função automatizada para testar violações de acessibilidade em websites, com `axe-playwright`.
  - `checkAlternativeTextInImages.ts`: Verifica a presença de texto alternativo em imagens de uma página.
  - `checkHeaderTags.ts`: Teste da utilização adequada de cabeçalhos para SEO e acessibilidade.
  - `checkMetaTags.ts`: Verificação de meta tags essenciais para SEO, com suporte para diferentes idiomas.
  - `checkOgTags.ts`: Avaliação das Open Graph tags de uma página.
  - `checkSpellingErrors.ts`: Identificação de erros ortográficos em conteúdo de páginas web.
  - `checkValidLinks.ts`: Verificação da validade dos links em uma página.

- **Types**
  - `types.ts`: Definição do tipo `language` para configurações de idioma.

### Fixed

- Melhorias na documentação e comentários explicativos.
- Refinamento de código para eficiência e confiabilidade.
