// this script will be used to get the information the user inputed in the filter section
import { saveName } from '../bookmark.mjs';

let page = 0;
let numOfNames = 0;
let numOfNamesPerPage = 0;

export function searchListener () {
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', event => {
    getNames();
    page = 0;
  });
}

export async function getNames () {
  try {
    const genderVal = document.querySelector('input[name="gender"]:checked').value;
    const genderStr = genderVal === 'b' ? '' : genderVal;

    const prefixStr = document.querySelector('input[name="prefix"]:checked').value;
    const prefixVal = document.getElementById('prefix-text').value;

    const suffixStr = document.querySelector('input[name="suffix"]:checked').value;
    const suffixVal = document.getElementById('suffix-text').value;

    const syllablesVal = document.getElementById('syllables-slider').value;

    const response = await fetch(`https://name-voyager.onrender.com/names?gender=${genderStr}&&${prefixStr}=${prefixVal}&&${suffixStr}=${suffixVal}&&syllables=${syllablesVal}`);
    const result = await response.json();
    numOfNames = result.length;

    numOfNamesPerPage = document.getElementById('numOfNames-slider').value;

    document.getElementById('current-page').innerHTML = `${page + 1} of ${Math.ceil(numOfNames / numOfNamesPerPage)}`;
    console.log(result);
    await createNameDOMObjects(result, page, numOfNamesPerPage);
  } catch (error) {
    console.error(error.message);
  }
}

export function pageListener () {
  const left = document.getElementsByClassName('page-nav')[0];
  const right = document.getElementsByClassName('page-nav')[2];
  left.addEventListener('click', event => pageBack());
  right.addEventListener('click', event => pageForward());
  left.addEventListener('mouseover', event => updateCursor());
  right.addEventListener('mouseover', event => updateCursor());
  updateCursor();
}

function updateCursor () {
  const left = document.getElementsByClassName('page-nav')[0];
  const right = document.getElementsByClassName('page-nav')[2];
  if (page === 0) {
    left.style.cursor = 'not-allowed';
  } else {
    left.style.cursor = 'pointer';
  }
  if (page === Math.ceil(numOfNames / numOfNamesPerPage) - 1 || numOfNames === 0) {
    right.style.cursor = 'not-allowed';
  } else {
    right.style.cursor = 'pointer';
  }
}

function pageBack () {
  if (page >= 1) page = page - 1;
  document.getElementById('current-page').innerHTML = `${page + 1} of ${Math.ceil(numOfNames / numOfNamesPerPage)}`;
  updateCursor();
  getNames();
}

function pageForward () {
  if (page <= Math.ceil(numOfNames / numOfNamesPerPage) - 2) page = page + 1;
  document.getElementById('current-page').innerHTML = `${page + 1} of ${Math.ceil(numOfNames / numOfNamesPerPage)}`;
  updateCursor();
  getNames();
}

async function createNameDOMObjects (json) {
  document.getElementsByClassName('results-container')[0].innerHTML = '';
  for (let i = page * numOfNamesPerPage; i < Math.min((page + 1) * numOfNamesPerPage, json.length); i++) {
    const element = json[i];
    document.getElementsByClassName('results-container')[0].insertAdjacentHTML('beforeend',
      `<div class="element ${element.gender}" id="${element.name}">${element.name}<span class="syllables-of-name">&nbsp;${element.syllables}</span>
        <img src="./assets/favorite_FILL0_wght400_GRAD0_opsz24_red.svg" alt="favorite symbol" class="save-name-button">
      </div>`);
  }
  saveName(); // add listeners to new dom childs / we are not removing them currently but i wouldn't know how chat gpt says its generally a good idea
}
