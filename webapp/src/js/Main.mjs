
// esbuild gonna put this stuff into "bundle.js"
// & terser gonna make it only the console.log line, since rest is useless

import { handleVisibilityChange } from './attention-seeker.mjs';
import { initializeFilterDropdown } from './nextsite/filter-dropdown.mjs';
import { bookmarkPopup, bookmarkList, copyToClipboard, removeElement } from './bookmark.mjs';

window.onload = function () {
  handleVisibilityChange();
  initializeFilterDropdown();
  bookmarkPopup();
  bookmarkList();
  copyToClipboard();
  removeElement();
};
