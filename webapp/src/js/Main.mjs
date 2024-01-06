
// esbuild gonna put this stuff into "bundle.js"

import { handleVisibilityChange } from './attention-seeker.mjs';
import { initializeSlider } from './nextsite/slider.mjs';
import { addSearchListener, addPageListener } from './nextsite/search.mjs';
import { resetListener } from './nextsite/reset.mjs';
import { bookmarkPopup, bookmarkList, saveName } from './bookmark.mjs';
import { starMover } from './stars.mjs';
const images = document.querySelectorAll('.star-images');

window.onload = function () {
  handleVisibilityChange();

  initializeSlider();

  addSearchListener();
  addPageListener();

  resetListener();

  bookmarkPopup();
  bookmarkList();
  saveName();

  starMover();
  images.forEach(function (img) {
    img.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    img.style.position = 'fixed';
  });
};
