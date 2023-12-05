// Importações de todas as suas funções utilitárias e de verificação
import { addToExcel } from "./helpers/addToExcel";
import checkSpelling from "./helpers/checkSpelling";
import { pageSpeedTest } from "./helpers/pageSpeedTest";
import { toSlug } from "./helpers/toSlug";
import checkAccessibilityViolations from "./utils/checkAccessibilityViolations";
import checkAlternativeTextInImages from "./utils/checkAlternativeTextInImages";
import checkHeaderTags from "./utils/checkHeaderTags";
import checkMetaTags from "./utils/checkMetaTags";
import checkOgTags from "./utils/checkOgTags";
import checkSpellingErrors from "./utils/checkSpellingErrors";
import checkValidLinks from "./utils/checkValidLinks";

// Exportando as funções para serem acessíveis para quem importar sua biblioteca
export {
  addToExcel,
  checkSpelling,
  pageSpeedTest,
  toSlug,
  checkAccessibilityViolations,
  checkAlternativeTextInImages,
  checkHeaderTags,
  checkMetaTags,
  checkOgTags,
  checkSpellingErrors,
  checkValidLinks,
};

// Adicione qualquer código de inicialização adicional que sua biblioteca possa precisar aqui
