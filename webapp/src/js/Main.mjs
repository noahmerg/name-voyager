
// esbuild gonna put this stuff into "bundle.js"

import { handleVisibilityChange } from './attention-seeker.mjs';
import { bookmarkPopup, bookmarkList } from './frontpage/bookmark.mjs';
import { initializeSlider } from './nextsite/slider.mjs';
import { searchListener } from './nextsite/search.mjs';
import { resetListener } from './nextsite/reset.mjs';
import { starMover } from './stars.mjs';
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const img4 = document.getElementById('img4');

window.onload = function () {
  handleVisibilityChange();
  bookmarkPopup();
  bookmarkList();
  initializeSlider();
  searchListener();
  resetListener();
  starMover();
  img1.style.position = 'fixed';
  img2.style.position = 'fixed';
  img3.style.position = 'fixed';
  img4.style.position = 'fixed';
};
