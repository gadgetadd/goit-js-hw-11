import axios from 'axios';

export default class PixabayAPI {
  BASE_URL = 'https://pixabay.com/api/';
  baseOpts = {
    key: '34015985-cdabfca0e623259de7e0e3639',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 36,
  };
  totalHits = 0;
  receivedHits = 0;
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
      this.totalHits = response.data.totalHits;
      this.receivedHits += response.data.hits.length;
      return response.data;
    } catch {
      throw new Error('data retrieval error');
    }
  }

  isLoadingDone() {
    return this.receivedHits >= this.totalHits;
  }
}
