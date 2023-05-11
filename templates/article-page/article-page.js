import {
  buildBlock,
} from '../../scripts/lib-franklin.js';

function createTemplateBlock(main, blockName, gridName) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.classList.add('article-template-autoblock', `article-template-grid-${gridNameValue}`);

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  main.append(section);
}

// eslint-disable-next-line import/prefer-default-export
export function buildTemplateBlock(main) {
  createTemplateBlock(main, 'navigation');
  createTemplateBlock(main, 'article-author');
  createTemplateBlock(main, 'pet-insurance-quote');
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'table-of-contents');
  createTemplateBlock(main, 'pet-insurance-quote', 'pet-insurance-quote-after');
  createTemplateBlock(main, 'paws-up-count');
  createTemplateBlock(main, 'paws-up');
  createTemplateBlock(main, 'social-links', 'social-links-after');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-navigation');
}