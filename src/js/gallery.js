import createGalleryCards from './tamplates/gallery-card.hbs';
import { PixabayAPI } from './pixabayAPI';

const gallery = document.querySelector('.gallery');
const pixabayAPI = new PixabayAPI();

async function onRenderPage(page) {
  const respons = await pixabayAPI.getPopularPhotos(1);
  console.log(respons.data);
  gallery.innerHTML = createGalleryCards(respons.data.hits);
}
onRenderPage();
console.log(createGalleryCards);
