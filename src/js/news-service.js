import axios from 'axios';

export class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    const BASE_URL = 'https://pixabay.com/api/';
    const options = {
      key: '29860210-f6d08db11b6c43066ac2ccb28',
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: `${this.page}`,
    };

    try {
      const response = await axios
        .get(BASE_URL, { options })
        .then(res => {
          this.incrementPage();
          return res.data;
        })
        .then(console.log);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
