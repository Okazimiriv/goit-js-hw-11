import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '35953983-a066171bf8548120346cceae4';
  #query = '';

  constructor() {
    this.page = 1;
    this.per_page = 40;
  }

  getPhotoByQuery() {
    return axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}`, {
      params: {
        q: this.#query,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
      },
    });
  }

  get query() {
    this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }
}
