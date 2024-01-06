import { initializeSlider } from './slider.mjs';
// this script will be used to get the information the user inputed in the filter section

// hardcoded
export function resetListener () {
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', event => resetValues());
}

function resetValues () {
  document.querySelector('input[name="gender"][value="b"]').checked = true;
  document.querySelector('input[name="prefix"][value="includeprefix"]').checked = true;
  document.getElementById('prefix-text').value = '';
  document.querySelector('input[name="suffix"][value="includesuffix"]').checked = true;
  document.getElementById('suffix-text').value = '';
  document.getElementById('syllables-slider').value = 0;
  document.getElementById('numOfNames-slider').value = 0;

  initializeSlider();
}
