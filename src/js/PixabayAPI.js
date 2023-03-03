import axios from 'axios';

export default class PixabayAPI {
  BASE_URL = 'https://pixabay.com/api/';
  baseOpts = {
    key: '34015985-cdabfca0e623259de7e0e3639',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 12,
  };
  constructor(query) {
    this.options = {
      ...this.baseOpts,
      q: query,
    };
  }

  async get() {
    try {
      const response = await axios.get(this.BASE_URL, { params: this.options });
      this.options.page += 1;
      return response.data.hits;
    } catch {
      Notify.failure('Something went wrong');
      return [];
    }
  }
}
