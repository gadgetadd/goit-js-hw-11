import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import InfiniteScroll from 'infinite-scroll';
import generateCardMarkup from './js/card-template';
import PixabayIMG from './js/getImages';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const onFormSubmit = e => {
  e.preventDefault();
  renderGallery(e.currentTarget.elements.searchQuery.value);
};

const renderGallery = async query => {
  try {
    const imageArray = await PixabayIMG.get(query);
    if (imageArray.length === 0) {
      return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const galleryCardsMarkup = imageArray.reduce((markup, image) => {
      return (markup += generateCardMarkup(image));
    }, '');
    refs.gallery.innerHTML = galleryCardsMarkup;
  } catch {
    return Notify.failure('Something went wrong');
  }
};

refs.searchForm.addEventListener('submit', onFormSubmit);
