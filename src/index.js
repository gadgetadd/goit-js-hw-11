import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import generateCardMarkup from './js/card-template';
import PixabayAPI from './js/PixabayAPI';
import throttle from 'lodash.throttle';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadingImg: document.querySelector('.loading-animation'),
};

let searchInstance;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const getQueryData = async instance => {
  try {
    return await instance.get();
  } catch {
    Notify.error('Something went wrong. Please try again later.');
  }
};
const renderGallery = ({ hits = [] }) => {
  refs.loadingImg.classList.add('is-hidden');
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const galleryCardsMarkup = hits.reduce((markup, image) => {
    return (markup += generateCardMarkup(image));
  }, '');
  refs.gallery.insertAdjacentHTML('beforeend', galleryCardsMarkup);
  lightbox.refresh();
};

const displayNotification = ({ totalHits }) => {
  Notify.success(`Hooray! We found ${totalHits} images.`);
};

const onFormSubmit = async e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.loadingImg.classList.remove('is-hidden');
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  searchInstance = new PixabayAPI(searchQuery);
  const searchData = await getQueryData(searchInstance);
  renderGallery(searchData);
  if (searchData.totalHits) {
    displayNotification(searchData);
  }
  refs.gallery.addEventListener('scroll', onScroll);
};

const onScroll = throttle(async () => {
  const scrollOffset = 120;
  const scrollPosition = refs.gallery.scrollHeight - refs.gallery.scrollTop;
  const isScrollDown =
    scrollPosition - scrollOffset <= refs.gallery.clientHeight;
  const isLoaded = refs.loadingImg.classList.contains('is-hidden');

  if (isScrollDown && isLoaded && searchInstance.isDone()) {
    refs.gallery.removeEventListener('scroll', onScroll);
    return Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }

  if (isScrollDown && isLoaded) {
    refs.loadingImg.classList.remove('is-hidden');
    const searchData = await getQueryData(searchInstance);
    renderGallery(searchData);
  }
}, 300);

refs.searchForm.addEventListener('submit', onFormSubmit);
