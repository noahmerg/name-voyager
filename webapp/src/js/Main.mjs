
// esbuild gonna put this stuff into "bundle.js"
// & terser gonna make it only the console.log line, since rest is useless

import { handleVisibilityChaange } from "./attention-seeker.mjs";
import { initializeFilterDropdown } from './nextsite/filter-dropdown.mjs';

window.onload = function () {
  handleVisibilityChaange();
  initializeFilterDropdown();
}