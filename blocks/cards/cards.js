import { getCategories } from '../../scripts/scripts.js';
import { createOptimizedPicture, toClassName } from '../../scripts/lib-franklin.js';

async function buildPost(post) {
  const categories = await getCategories();
  const category = categories.data.find((c) => {
    if (post.category && post.category !== '0') {
      return c.Slug === toClassName(post.category)
        || c.Category.toLowerCase() === post.category.toLowerCase();
    }
    return c.Slug === post.path.split('/').splice(-2, 1)[0];
  });
  const postCard = document.createElement('div');
  postCard.classList.add('blog-cards');
  const postDate = new Date(0);
  postDate.setUTCSeconds(post.date);
  const postDateStr = postDate.getMonth().toString().concat(' ', postDate.getDate(), ', ', postDate.getFullYear());
  const style = `--bg-color: var(--color-${category.Color}); --border-color: var(--color-${category.Color}); `;
  postCard.innerHTML = `
      <div class="blogs-card-image">
        <a href="${post.path}">${createOptimizedPicture(post.image, `Teaser image for ${post.title}`, false, [{ width: 800 }]).outerHTML}</a>
        ${category.Category !== 'Breeds' ? `<a class="blogs-card-category" href=${category.Path} style ="${style}">${category.Category}</a>` : ''}
      </div>
      <div>              
        <a href="${post.path}">
        <div class="blogs-card-body">
        <h3>${post.title.replace(/- PetPlace$/, '')}</h3>
        ${category.Category !== 'Breeds' ? `<p><span class="card-date"> <time datetime="${postDateStr}">${postDateStr}</time> · ${post.author}</span></p>` : ''}
      </div></a>          
      </div>
    </a>
  `;
  if (category.Category !== 'Breeds') {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        postCard.querySelector('time').textContent = postDate.toLocaleString('default', { month: 'long' }).concat(' ', postDate.getDate(), ', ', postDate.getFullYear());
      });
    });
  }
  return postCard;
}

async function createCard(row) {
  const li = document.createElement('li');
  const post = JSON.parse(row.dataset.json);
  li.append(await buildPost(post));
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach(async (row) => {
    if (row.textContent.trim()) {
      ul.append(await createCard(row));
    }
  });
  block.innerHTML = '';
  block.append(ul);
  const observer = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      entry.addedNodes.forEach(async (div) => {
        ul.append(await createCard(div));
        div.remove();
      });
    });
  });
  observer.observe(block, { childList: true });
}
