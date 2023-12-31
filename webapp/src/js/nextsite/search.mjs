import { getNames } from './getnames.mjs';
// this script will be used to get the information the user inputed in the filter section

export function searchListener () {
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', event => getNames());
  searchButton.addEventListener('click', event => printValues());
}

// How to get all the values: printExample
function printValues () {
  // GENDER
  const gender = document.querySelector('input[name="gender"]:checked').value;
  /* different possibility:
  const elems = document.getElementsByName('gender');
  elems.forEach(elem => {
    if (elem.checked) {
      const gender = elem.value;
    }
  }); */
  console.log(gender);

  // PREFIX
  const prefix = document.querySelector('input[name="prefix"]:checked').value;
  const prefixString = document.getElementById('prefix-text').value;
  console.log(prefix + prefixString);

  // SUFFIX
  const suffix = document.querySelector('input[name="suffix"]:checked').value;
  const suffixString = document.getElementById('suffix-text').value;
  console.log(suffix + suffixString);

  // SYLLABLES
  const syllables = document.getElementById('syllables-slider').value;
  console.log(syllables);
}
