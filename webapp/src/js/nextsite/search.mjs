// this script will be used to get the information the user inputed in the filter section
import { saveName } from '../bookmark.mjs';

const API_URL = 'http://localhost:8080';

let page = 0;
let numOfNames = 0;
let numOfNamesPerPage = 0;
let maxPage = 0;
let names = '';
let stringNames = [];
let bookmarkStringNames = [];

let doubleleft = document.getElementById('page-doubleback');
let left = document.getElementById('page-back');
const currentPageInput = document.getElementById('input-current-page');
let right = document.getElementById('page-forward');
let doubleright = document.getElementById('page-doubleforward');

const resultsContainer = document.getElementsByClassName('results-container')[0];

export function addSearchListener () {
  document.getElementById('search-button').addEventListener('click', event => {
    document.getElementById('pages-container').style.display = 'grid';
    getNames();
    getBookmarkNames();
  });
}

export async function getNames () {
  try {
    const response = await fetch(buildAPIURL());
    const result = await response.json();

    updateVariables(result);
    updateDOMTree();
  } catch (error) {
    console.error(error.message);
  }
}

export async function getBookmarkNames () {
  try {
    const response = await fetch('http://localhost:8080/bookmarklist');
    const bookmarkNames = await response.json();
    bookmarkStringNames = bookmarkNames.map(bookmark => bookmark.name);
    console.log(bookmarkStringNames);
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

  return `${API_URL}/names?gender=${genderStr}&&${prefixStr}=${prefixVal}&&${suffixStr}=${suffixVal}&&syllables=${syllablesVal}`;
}

function updateVariables (result) {
  page = 0;
  names = result;
  numOfNames = result.length;
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
      page = parseInt(event.currentTarget.value) - 1;
      updateDOMTree();
    }
  });
  currentPage.addEventListener('blur', event => { // when currentPage goes from active to not-active
    page = parseInt(event.currentTarget.value) - 1;
    updateDOMTree();
  });
}

function pageBack () {
  if (page >= 1) page = page - 1;
  updateDOMTree();
}

function pageDoubleBack () {
  if (page >= 1) page = 0;
  updateDOMTree();
}

function pageForward () {
  if (page <= maxPage - 1) page = page + 1;
  updateDOMTree();
}

function pageDoubleForward () {
  if (page <= maxPage - 1) page = maxPage;
  updateDOMTree();
}

function updateDOMTree () {
  updateCursor();
  updateCurrentPageLabel();
  updateNames();
  markBookmarkedNames();
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
  currentPageInput.value = page + 1; // update value and
  currentPageInput.max = maxPage + 1; // update max
  document.getElementById('max-page').innerHTML = `of ${maxPage + 1}`;
}

async function updateNames () {
  removeAllNames();

  for (let i = page * numOfNamesPerPage; i < Math.min((page + 1) * numOfNamesPerPage, names.length); i++) {
    resultsContainer.insertAdjacentHTML('beforeend', buildElementHTML(names[i]));
    stringNames.push(names[i].name);
  }
  saveName(); // add listeners to new DOM children
}

export async function markBookmarkedNames () {
  await getBookmarkNames();
  stringNames.forEach(stringName => {
    bookmarkStringNames.forEach(bookmarkName => {
      const element = resultsContainer.querySelector(`#${stringName}`);
      if (element.getAttribute('data-liked') === 'true') {
        element.querySelector('img').style.filter = 'brightness(1) invert(0) drop-shadow(0 0 2px red)';
      } else {
        element.querySelector('img').style.filter = 'brightness(0) invert(1)';
      }
    });
  });
}

function removeAllNames () {
  // Select only the elements you want to remove (exclude those that shouldn't be deleted)
  [...resultsContainer.getElementsByClassName('element')].forEach(elem => elem.remove());
  stringNames = [];
}

function buildElementHTML (element) {
  return `<div class="element ${element.gender}" id="${element.name}">${element.name}<span class="syllables-of-name">&nbsp;${element.syllables}</span>
            <img src="./assets/favorite_FILL0_wght400_GRAD0_opsz24_red.svg" alt="favorite symbol" class="save-name-button">
          </div>`;
}
