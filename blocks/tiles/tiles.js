import { getCategory } from '../../scripts/scripts.js';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

let articles;
export default async function decorate(block) {
  // Create containing div of three tiles (one big, two small)
  const tileContainer = document.createElement('div');
  tileContainer.className = 'tiles-block-container';

  if (!articles) {
    const res = await fetch('/article/query-index.json?sheet=article');
    const queryData = await res.json();
    articles = queryData?.data;
  }

  const data = [...block.children].map((row) => {
    const path = new URL(row.firstElementChild.firstElementChild.href).pathname;

    for (let i = 0; i < articles.length; i += 1) {
      if (articles[i].path === path) {
        return articles[i];
      }
    }
    // eslint-disable-next-line no-console
    console.error(`No article in index found for ${path}`);
    return null;
  }).filter((item) => item); // filter out null values returned from the for loop

  const categories = await Promise.all(data.map(async (dta) => {
    if (dta.category && dta.category !== '0') {
      return dta.category;
    }
    const category = await getCategory(dta.path.split('/').slice(-2).shift());
    if (category) {
      return category.Category;
    }
    return null;
  }));

  data.forEach((dta, index) => {
    // Create tile div for each individual tile
    const tile = document.createElement('div');
    tile.classList.add('tile');

    const imgPadding = document.createElement('div');
    if (index === 0) {
      tile.classList.add('tile-0');
      imgPadding.classList.add('img-padding');
    }

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    // Create Image tag.. future will be <picture> tag
    let img;
    if (index === 0) {
      img = document.createElement('img');
      img.src = dta.image;
    } else {
      img = document.createElement('a');
      img.href = dta.path;
      const imgTag = document.createElement('img');
      imgTag.src = dta.image;
      img.append(imgTag);
    }

    // Create content div.  This contains title, author, date etc..
    const content = document.createElement('div');
    content.className = 'tile-contents';

    const categoryLink = document.createElement('a');
    categoryLink.className = 'category-link-btn';
    categoryLink.href = dta.path.substring(0, dta.path.lastIndexOf('/'));
    categoryLink.innerHTML = categories[index];

    const categoryLinkMobile = categoryLink.cloneNode(true);
    categoryLinkMobile.classList.add('category-link-btn-mobile');

    const title = document.createElement('a');
    title.href = dta.path;
    const titleHeader = document.createElement('h3');
    titleHeader.innerHTML = dta.title.endsWith(' - PetPlace')
      ? dta.title.substring(0, dta.title.lastIndexOf(' - PetPlace'))
      : dta.title;
    title.append(titleHeader);
    const dateAuthorContainer = document.createElement('div');
    dateAuthorContainer.classList.add('date-author-container');

    const date = new Date(dta.date * 1000);
    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
    const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    dateAuthorContainer.append(`${formattedDate} · `);
    dateAuthorContainer.append(dta.author);

    imgContainer.append(imgPadding);
    imgContainer.append(img);
    content.append(categoryLink);
    content.append(title);
    content.append(dateAuthorContainer);

    tile.append(imgContainer);
    if (index === 0) {
      tile.append(categoryLinkMobile);
    }
    tile.append(content);

    tileContainer.append(tile);
  });

  // Check if there are enough child nodes in tileContainer
  if (tileContainer.children.length >= 3) {
    const smallTilesWrapper = document.createElement('div');
    smallTilesWrapper.className = 'small-tiles-wrapper';
    // Move the second and third child nodes into the smallTilesWrapper
    // Not a mistake using index 1 two times.  When we appended smallTilesWrapper
    // with the first child
    // then that child is removed... leaving us with just two.
    smallTilesWrapper.append(tileContainer.children[1]);
    smallTilesWrapper.append(tileContainer.children[1]);
    // Replace the second and third child nodes in tileContainer with the smallTilesWrapper
    tileContainer.append(smallTilesWrapper);
  }

  block.textContent = '';
  block.append(tileContainer);
}
