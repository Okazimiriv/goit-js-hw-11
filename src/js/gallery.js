import createGalleryCards from './tamplates/gallery-card.hbs';
import { PixabayAPI } from './pixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loadMoreBtn = document.querySelector('.load-more');
const searchForm = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.gallery');

const pixabayAPI = new PixabayAPI();

// const options = {
//   totalItems: 0,
//   perPage: 40,
//   visiblePages: 5,
//   page: 1,
//   total: 0,
// };

const perPage = 40;
let totalPage = 0;
let page = 1;

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

searchForm.addEventListener('submit', onSearchForm);
// loadMoreBtn.addEventListener('click', onLoadMore);

const loadMorePhotos = async function (entries, observer) {
  console.log(entries[0].isIntersecting);
  try {
    if (entries[0].isIntersecting) {
      page += 1;
      observer.disconnect();
      const respons = await pixabayAPI.getPhotoByQuery(page);
      galleryEl.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(respons.data.hits)
      );
      observer.observe(galleryEl.lastElementChild);
      console.log(page, totalPage);
      if (page === totalPage) {
        Report.failure(
          "We're sorry, but you've reached the end of search results."
        );
        // btnEl.classList.add('is-hidden');
        observer.disconnect();
        return;
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
const observer = new IntersectionObserver(loadMorePhotos, options);

async function onSearchForm(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements['searchQuery'].value
    .trim()
    .toLowerCase();

  pixabayAPI.query = searchQuery;

  if (!searchQuery) {
    clearPage();
    return Notify.warning(
      'Sorry, there are no images matching your search query.'
    );
  }
  page = 1;
  try {
    const respons = await pixabayAPI.getPhotoByQuery(page, perPage);

    if (respons.data.hits.length === 0) {
      clearPage();
      return Notify.failure('Bad request. Please try again.');
    } else {
      Notify.info(`Hooray! We found ${respons.data.totalHits} images.`);
    }
    if (respons.data.hits.length < perPage) {
      loadMoreBtn.classList.add('is-hidden');
      return galleryEl.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(respons.data.hits)
      );
    }
    totalPage = Math.ceil(respons.data.totalHits / perPage);
    console.log('totalPage', totalPage);

    loadMoreBtn.classList.remove('is-hidden');

    galleryEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(respons.data.hits)
    );
    observer.observe(galleryEl.lastElementChild);
    gallery.refresh();
  } catch (error) {
    console.log(error);
  }
}

// async function onLoadMore() {
//   console.log('onLoadMore');
//   try {
//     page += 1;
//     const response = await pixabayAPI.getPhotoByQuery(page);

//     const markup = createGalleryCards(respons.data.hits);
//     galleryEl.insertAdjacentHTML('beforeend', markup);

//     galleryEl.refresh();
//     console.log('page', page);
//     console.log('totalPage', totalPage);
//     if (page === totalPage) {
//       return Notify.info(
//         'We are sorry, but you have reached the end of search results.'
//       );
//     }
//   } catch (error) {
//     Notify.failure('Something went wrong!');

//     clearPage();
//   }
// }

function clearPage() {
  // pixabayAPI.resetPage();
  galleryEl.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
}
