import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { NewsApiService } from './news-service';
import { getRefs } from './getRefs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
const newsApiService = new NewsApiService();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  try {
    if (newsApiService.query === '') {
      return Notify.failure('Please write what to look for');
    }
    newsApiService.resetPage();

    const res = await newsApiService.fetchArticles();
    if (res.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.classList.add('is-hidden');
    }
    refs.form.reset();
    clearGallery();
    Notify.success(`Hooray! We found ${res.totalHits} images.`);
    renderGallery(res.hits);
    if (newsApiService.page > 2) {
      scroll();
    }
    if (res.totalHits <= 40) {
      return Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.classList.add('is-hidden');
    } else {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore(e) {
  try {
    const res = await newsApiService.fetchArticles();
    renderGallery(res.hits);
    if (res.hits / newsApiService.page < 40) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function renderGallery(data) {
  const render = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) => `<div class='card'>
    <a class="card-item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
    </div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML(`beforeend`, render);
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh();
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
