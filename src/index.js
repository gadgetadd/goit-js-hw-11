import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import generateCardMarkup from './js/card-template';
import PixabayAPI from './js/PixabayAPI';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBTN: document.querySelector('.load-more'),
};

let searchData;

const onFormSubmit = async e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  const searchQuery = e.currentTarget.elements.searchQuery.value;
  searchData = new PixabayAPI(searchQuery);
  const isValid = await renderGallery(searchData);
  if (isValid) {
    refs.loadMoreBTN.hidden = false;
    refs.loadMoreBTN.addEventListener('click', onLoadMoreClick, { once: true });
  }
};

const onLoadMoreClick = async () => {
  renderGallery(searchData).then(console.log);
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const renderGallery = async data => {
  const imageArray = await data.get();
  if (imageArray.length === 0) {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return false;
  }
  const galleryCardsMarkup = imageArray.reduce((markup, image) => {
    return (markup += generateCardMarkup(image));
  }, '');
  refs.gallery.insertAdjacentHTML('beforeend', galleryCardsMarkup);
  lightbox.refresh();

  return true;
};

refs.searchForm.addEventListener('submit', onFormSubmit);
