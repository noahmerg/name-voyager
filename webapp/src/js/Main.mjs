
// esbuild gonna put this stuff into "bundle.js"

import { handleVisibilityChange } from './attention-seeker.mjs';
import { bookmarkPopup, bookmarkList } from './frontpage/bookmark.mjs';
import { initializeSlider } from './nextsite/slider.mjs';
import { searchListener } from './nextsite/search.mjs';
import { resetListener } from './nextsite/reset.mjs';
window.onload = function () {
  handleVisibilityChange();
  bookmarkPopup();
  bookmarkList();
  initializeSlider();
  searchListener();
  resetListener();
};
