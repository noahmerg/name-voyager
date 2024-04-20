// this script will be used to get the information the user inputed in the filter section
import { saveName } from '../bookmark.mjs';

const API_URL = 'http://localhost:8080';

let page = 0;
let numOfNames = 0;
let numOfNamesPerPage = 0;
let maxPage = 0;
let names = '';
const bookmarkNames = new Set();

let doubleleft = document.getElementById('page-doubleback');
let left = document.getElementById('page-back');
const currentPageInput = document.getElementById('input-current-page');
let right = document.getElementById('page-forward');
let doubleright = document.getElementById('page-doubleforward');

const resultsContainer = document.getElementsByClassName('results-container')[0];

export function addSearchListener () {
  document.getElementById('search-button').addEventListener('click', event => {
    document.getElementById('pages-container').style.display = 'grid';
    page = 0;
    getNames();
  });
}

export async function getNames () {
  try {
    const response = await fetch(buildAPIURL());
    const result = await response.json();
    updateVariables(result);
    updateCursor();
    updateCurrentPageLabel();
    updateNames();
  } catch (error) {
    console.error(error.message);
  }
}

function buildAPIURL () {
  const genderVal = document.querySelector('input[name="gender"]:checked').value;
  const genderStr = genderVal === 'b' ? '' : genderVal;

  const prefixStr = document.querySelector('input[name="prefix"]:checked').value;
  const prefixVal = document.getElementById('prefix-text').value;

  const suffixStr = document.querySelector('input[name="suffix"]:checked').value;
  const suffixVal = document.getElementById('suffix-text').value;

  const syllablesVal = document.getElementById('syllables-slider').value;

  const min = page * document.getElementById('numOfNames-slider').value;
  const max = (page + 1) * document.getElementById('numOfNames-slider').value;

  return `${API_URL}/names?gender=${genderStr}&&${prefixStr}=${prefixVal}&&${suffixStr}=${suffixVal}&&syllables=${syllablesVal}&&min=${min}&&max=${max}`;
}

function updateVariables (result) {
  names = result.names;
  numOfNames = result.totalCount;
  numOfNamesPerPage = document.getElementById('numOfNames-slider').value;
  maxPage = Math.ceil(numOfNames / numOfNamesPerPage) - 1;
}

export function addPageListener () {
  doubleleft.addEventListener('click', pageDoubleBack);
  left.addEventListener('click', pageBack);
  right.addEventListener('click', pageForward);
  doubleright.addEventListener('click', pageDoubleForward);

  const currentPage = document.getElementById('input-current-page');
  currentPage.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      page = Math.min(Math.max(parseInt(event.currentTarget.value) - 1, 0), maxPage);
      getNames();
    }
  });
  currentPage.addEventListener('blur', event => { // when currentPage goes from active to not-active
    page = Math.min(Math.max(parseInt(event.currentTarget.value) - 1, 0), maxPage);
    getNames();
  });
}

function pageBack () {
  if (page >= 1) page = page - 1;
  getNames();
}

function pageDoubleBack () {
  if (page >= 1) page = 0;
  getNames();
}

function pageForward () {
  if (page <= maxPage - 1) page = page + 1;
  getNames();
}

function pageDoubleForward () {
  if (page <= maxPage - 1) page = maxPage;
  getNames();
}

function updateCursor () {
  doubleleft = document.getElementById('page-doubleback');
  left = document.getElementById('page-back');
  right = document.getElementById('page-forward');
  doubleright = document.getElementById('page-doubleforward');
  if (page === 0) {
    left.style.cursor = 'not-allowed';
    doubleleft.style.cursor = 'not-allowed';
  } else {
    left.style.cursor = 'pointer';
    doubleleft.style.cursor = 'pointer';
  }
  if (page === maxPage) {
    right.style.cursor = 'not-allowed';
    doubleright.style.cursor = 'not-allowed';
  } else {
    right.style.cursor = 'pointer';
    doubleright.style.cursor = 'pointer';
  }
}

function updateCurrentPageLabel () {
  currentPageInput.value = numOfNames > 0 ? page + 1 : 0; // update value and
  currentPageInput.max = maxPage + 1; // update max value of number input field
  document.getElementById('max-page').innerHTML = `of ${maxPage + 1}`;
}

async function updateNames () {
  removeAllNames();
  for (let i = 0; i < names.length; i++) {
    resultsContainer.insertAdjacentHTML('beforeend', await buildElementHTML(names[i]));
    markName(names[i].name, await isNameBookmarked(names[i].name));
  }
  saveName(); // add listeners to new DOM children
}

export async function isNameBookmarked (name) {
  return bookmarkNames.has(name);
}

export function markName (name, newState) {
  // Use querySelector to select the element with the specific ID (had to escape ')
  const nameElement = resultsContainer.querySelector(`#${name.replace(/'/g, "\\'")}`);

  // Update the src attribute for the save-name-button's img within the selected element
  if (nameElement) {
    const saveButtonImg = nameElement.getElementsByTagName('img')[0];
    if (saveButtonImg) {
      saveButtonImg.style.filter = newState
        ? 'brightness(1) invert(0)'
        : 'brightness(0) invert(1)';
      newState ? bookmarkNames.add(name) : bookmarkNames.delete(name);
    }
  }
}

function removeAllNames () {
  // Select only the elements you want to remove (exclude those that shouldn't be deleted)
  [...resultsContainer.getElementsByClassName('element')].forEach(elem => elem.remove());
}

async function buildElementHTML (element) {
  return `<div class="element ${element.gender}" id="${element.name}" data-liked="false">
            ${element.name}<span class="syllables-of-name">&nbsp;${element.syllables}</span>
            <img src="./assets/favorite_FILL0_wght400_GRAD0_opsz24_red.svg" alt="favorite symbol" class="save-name-button">
          </div>`;
}
