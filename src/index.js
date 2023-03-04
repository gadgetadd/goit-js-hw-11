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

const onFormSubmit = async e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.loadingImg.classList.remove('is-hidden');
  const searchQuery = e.currentTarget.elements.searchQuery.value;
  searchInstance = new PixabayAPI(searchQuery);
  searchData = await getQueryData(searchInstance);
  renderGallery(searchData);
  if (searchData.totalHits) {
    displayNotification(searchData);
  }
  refs.gallery.addEventListener('scroll', throttle(onScroll, 300));
};

const getQueryData = async instance => {
  try {
    const ddata = await instance.get();
    console.log(ddata);
    console.dir(refs.gallery);
    return ddata;
  } catch (error) {
    Notify.error('Network error. Please try again later.');
  }
};
const renderGallery = ({ totalHits = 0, hits = [] }) => {
  refs.loadingImg.classList.add('is-hidden');
  if (hits.length === 0) {
    Notify.warning(
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

refs.searchForm.addEventListener('submit', onFormSubmit);

const onScroll = async () => {
  const scrollOffset = 120;
  const scrollPosition = refs.gallery.scrollHeight - refs.gallery.scrollTop;
  const isScrollDown =
    scrollPosition - scrollOffset <= refs.gallery.clientHeight;

  if (isScrollDown && searchInstance.isLoadingDone()) {
    refs.gallery.removeEventListener('scroll', onScroll);
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  if (isScrollDown && refs.loadingImg.classList.contains('is-hidden')) {
    refs.loadingImg.classList.remove('is-hidden');
    searchData = await getQueryData(searchInstance);
    renderGallery(searchData);
  }
};
