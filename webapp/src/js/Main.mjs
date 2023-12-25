
// esbuild gonna put this stuff into "bundle.js"
// & terser gonna make it only the console.log line, since rest is useless

import { handleVisibilityChange } from './attention-seeker.mjs';
import { initializeFilterDropdown } from './nextsite/filter-dropdown.mjs';
import { bookmarkPopup } from './frontpage/bookmark.mjs';

window.onload = function () {
  handleVisibilityChange();
  initializeFilterDropdown();
  bookmarkPopup();
};
