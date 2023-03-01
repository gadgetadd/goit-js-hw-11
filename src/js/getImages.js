import axios from 'axios';

export default class PixabayIMG {
  static BASE_URL = 'https://pixabay.com/api/';
  static #API_KEY = '34015985-cdabfca0e623259de7e0e3639';
  static async get(query) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}?key=${
          this.#API_KEY
        }&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`
      );
      return response.data.hits;
    } catch (error) {
      return error;
    }
  }
}
