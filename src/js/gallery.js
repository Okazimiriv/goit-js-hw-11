import createGalleryCards from './tamplates/gallery-card.hbs';
import { PixabayAPI } from './pixabayAPI';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchBtn = document.querySelector('.search-btn');
const loadMoreBtn = document.querySelector('.load-more');
const searchForm = document.querySelector('.js-search-form');
const gallery = document.querySelector('.gallery');
const pixabayAPI = new PixabayAPI();
const container = document.getElementById('tui-pagination-container');

console.log(loadMoreBtn);
const options = {
  totalItems: 0,
  itemsPerPage: 40,
  visiblePages: 5,
  page: 1,
};
const pagination = new Pagination(container, options);

const page = pagination.getCurrentPage();
console.log('page', page);

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMore);
container.classList.add('is-hidden');

async function createByQueryPogination(event) {
  try {
    const currentPage = event.page;
    console.log('current page', currentPage);
    const respons = await pixabayAPI.getPhotoByQuery(currentPage);
    gallery.innerHTML = createGalleryCards(respons.data.hits);
  } catch (error) {
    console.log(error);
  }
}

async function onSearchForm(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['user-search-query'].value
    .trim()
    .toLowerCase();
  console.log(searchQuery);
  pixabayAPI.query = searchQuery;
  // loadMoreBtn.classList.remove('is-hidden');
  if (!searchQuery) {
    clearPage();
    return Notify.warning(
      'Sorry, there are no images matching your search query.'
    );
  }

  try {
    const respons = await pixabayAPI.getPhotoByQuery(page);
    if (respons.data.hits.length === 0) {
      clearPage();
      // container.classList.add('is-hidden');
      return Notify.failure('Bad request. Please try again.');
    }
    if (respons.data.hits.length < options.itemsPerPage) {
      loadMoreBtn.classList.add('is-hidden');
      gallery.innerHTML = createGalleryCards(respons.data.hits);
      return Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
    }
    gallery.innerHTML = createGalleryCards(respons.data.hits);
    loadMoreBtn.classList.remove('is-hidden');
    //   console.log(respons.data);
    //   pagination.reset(respons.data.total);
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore(event) {
  // pixaby.incrementPage();

  // if (!pixaby.hasMorePhotos) {
  //   loadMoreBtn.classList.remove('is-hidden');
  //   Notify.info("We're sorry, but you've reached the end of search results.");
  //   notifyInit;
  // }

  try {
    const currentPage = event.page;
    console.log('current page', currentPage);
    console.log(event);
    const respons = await pixabayAPI.getPopularPhotos(currentPage);
    gallery.innerHTML = createGalleryCards(respons.data.hits);
  } catch (error) {
    Notify.failure('Something went wrong!');

    clearPage();
  }
}

// async function createPopularPogination(event) {
//   try {
//     const currentPage = event.page;
//     console.log('current page', currentPage);
//     const respons = await pixabayAPI.getPopularPhotos(currentPage);
//     gallery.innerHTML = createGalleryCards(respons.data.hits);
//   } catch (error) {
//     console.log(error);
//   }
// }

// pagination.on('afterMove', createPopularPogination);
// onRenderPage();

// ____ пошук по запиту ____

function clearPage() {
  pixabayAPI.resetPage();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
}
