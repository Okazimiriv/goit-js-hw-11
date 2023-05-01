import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '35953983-a066171bf8548120346cceae4';
  #query = '';
  #page = 1;
  #per_page = 40;
  #totalPages = 0;

  getPopularPhotos(page) {
    return axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}`, {
      params: {
        // query: this.#query,
        query: 'cat',
        page: this.#page,
        per_page: this.#per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
  }
}
