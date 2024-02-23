
// esbuild gonna put this stuff into "bundle.js"

import { handleVisibilityChange } from './attention-seeker.mjs';
import { initializeSlider } from './nextsite/slider.mjs';
import { addSearchListener, addPageListener } from './nextsite/search.mjs';
import { resetListener } from './nextsite/reset.mjs';
import { bookmarkPopup, bookmarkList, saveName } from './bookmark.mjs';

window.onload = function () {
  handleVisibilityChange();

  initializeSlider();

  addSearchListener();
  addPageListener();

  resetListener();

  bookmarkPopup();
  bookmarkList();
  saveName();
};
