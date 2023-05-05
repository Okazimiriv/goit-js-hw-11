import createGalleryCards from './tamplates/gallery-card.hbs';
import { PixabayAPI } from './pixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loadMoreBtn = document.querySelector('.load-more');
const searchForm = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.gallery');

const pixabayAPI = new PixabayAPI();

// const perPage = 40;
// let totalPage = 0;

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: false,
});

const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

searchForm.addEventListener('submit', onSearchForm);
// loadMoreBtn.addEventListener('click', onLoadMore);

const loadMorePhotos = async function (entries, observer) {
  try {
    if (entries[0].isIntersecting) {
      pixabayAPI.page += 1;
      observer.disconnect();
      const respons = await pixabayAPI.getPhotoByQuery();
      galleryEl.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(respons.data.hits)
      );
      gallery.refresh();
      observer.observe(galleryEl.lastElementChild);

      const lastPage = Math.ceil(respons.data.totalHits / pixabayAPI.per_page);
      console.log('lastPage', lastPage);

      if (pixabayAPI.page === lastPage) {
        Notify.success(
          "We're sorry, but you've reached the end of search results."
        );

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
  clearPage();
  pixabayAPI.page = 1;
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

  try {
    const respons = await pixabayAPI.getPhotoByQuery();

    if (respons.data.hits.length === 0) {
      clearPage();
      return Notify.failure('Bad request. Please try again.');
    } else {
      Notify.info(`Hooray! We found ${respons.data.totalHits} images.`);
    }
    if (respons.data.hits.length < pixabayAPI.per_page) {
      loadMoreBtn.classList.add('is-hidden');

      galleryEl.insertAdjacentHTML(
        'beforeend',
        createGalleryCards(respons.data.hits)
      );
      gallery.refresh();
      return;
    }

    loadMoreBtn.classList.remove('is-hidden');
    clearPage();

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

function clearPage() {
  // pixabayAPI.resetPage();
  galleryEl.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
}
