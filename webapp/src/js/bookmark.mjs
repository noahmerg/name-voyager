// import { namesCollection } from '../../../server/db.mjs';
import { isNameBookmarked, markName } from './nextsite/search.mjs';

/**
 * changes text of save button and opens/closes bookmarklist
 */
export function bookmarkPopup () {
  const bookmarkList = document.getElementById('bookmark-list');
  const button = document.getElementById('save-button');
  const buttonText = button.children[0].children[0];
  button.addEventListener('click', function () {
    if (bookmarkList.classList.contains('open')) {
      bookmarkList.classList.remove('open');
      bookmarkList.classList.add('notOpen');
      buttonText.innerHTML = 'Bookmarks';
    } else {
      bookmarkList.classList.remove('notOpen');
      bookmarkList.classList.add('open');
      buttonText.innerHTML = 'Close';
    }
  });
}
/**
 * adds respective event listener to bookmarklist for functionality
 */
const bookmarkListBody = document.querySelector('.bookmark-body');
const toggleButtons = document.querySelectorAll('input[name="gender-toggle"]');
let draggedItem = null;
let requestGender = 'both';
const openButton = document.getElementById('save-button');
/**
   * creates favourite names list elements and fill them into bookmarkbody by pulling the names from the database
   */
async function fillBody () {
  try {
    let response = null;
    if (requestGender === 'both') {
      response = await fetch('http://localhost:8080/bookmarklist');
    } else {
      response = await fetch(`http://localhost:8080/bookmarklist?gender=${requestGender}`);
    }
    const result = await response.json();
    result.forEach((value) => {
      const exists = Array.from(bookmarkListBody.getElementsByClassName('favname')).some(el => el.textContent.includes(value.name));
      if (!exists) {
        createFavName(value);
      }
    });
  } catch (error) {
    console.error(error);
  }
  /**
     * creates a fav name element for the list and appends it to the list
     * @param {JSON} value needed to pull name and index from it
     */
  function createFavName (value) {
    const element = createFavNameContainer(value);
    const text = createNameText(value);
    const iconContainer = createIconContainer();
    const dragIconPath = './assets/drag_handle.svg';
    const copyIconPath = './assets/content_copy.svg';
    const deleteIconPath = './assets/delete.svg';
    if (requestGender === 'both') {
      const dragIcon = createDragIcon(dragIconPath);
      iconContainer.appendChild(dragIcon);
    }
    const copyIcon = createCopyIcon(copyIconPath);
    const deleteIcon = createDeleteIcon(deleteIconPath);
    element.appendChild(text);
    element.appendChild(iconContainer);
    iconContainer.appendChild(copyIcon);
    iconContainer.appendChild(deleteIcon);
    bookmarkListBody.appendChild(element);
  }
  /**
     * creates Icon Container Div
     * @returns {HTMLDivElement} icon container
     */
  function createIconContainer () {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    return iconContainer;
  }
  /**
     * creates a span with the favourite name by pulling it from the json
     * @param {JSON} value
     * @returns {HTMLSpanElement} span with name
     */
  function createNameText (value) {
    const text = document.createElement('span');
    text.textContent = value.name;
    return text;
  }
  /**
     * creates a div with the class favname that is draggable and assigns a index extracting it from the JSON to it
     * @param {JSON} value
     * @returns {HTMLDivElement} returns favname div
     */
  function createFavNameContainer (value) {
    const element = document.createElement('div');
    element.setAttribute('draggable', 'true');
    element.classList.add('favname');
    element.setAttribute('data-index', `${value.index}`);
    return element;
  }
  /**
     * creates a delete icon and assigns all needed classes, attributes and eventlistener
     * @param {String} deleteIconPath
     * @returns {HTMLImageElement} returns delete icon
     */
  function createDeleteIcon (deleteIconPath) {
    const deleteIcon = document.createElement('img');
    deleteIcon.setAttribute('src', deleteIconPath);
    deleteIcon.setAttribute('alt', 'drag-icon');
    deleteIcon.setAttribute('draggable', 'false');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.addEventListener('click', removeFunction);
    return deleteIcon;
  }
  /**
     * creates a drag icon and assigns all needed classes and attributes
     * @param {String} dragIconPath
     * @returns {HTMLImageElement} returns drag icon
     */
  function createDragIcon (dragIconPath) {
    const dragIcon = document.createElement('img');
    dragIcon.setAttribute('src', dragIconPath);
    dragIcon.setAttribute('alt', 'drag-icon');
    dragIcon.setAttribute('draggable', 'false');
    dragIcon.classList.add('drag-icon');
    return dragIcon;
  }
  /**
     * creates a copy icon and assigns all needed classes, attributes and eventlistener
     * @param {String} copyIconPath
     * @returns {HTMLImageElement} returns copy icon
     */
  function createCopyIcon (copyIconPath) {
    const copyIcon = document.createElement('img');
    copyIcon.setAttribute('src', copyIconPath);
    copyIcon.setAttribute('alt', 'drag-icon');
    copyIcon.setAttribute('draggable', 'false');
    copyIcon.classList.add('copy-icon');
    copyIcon.addEventListener('click', copyFunction);
    return copyIcon;
  }
}
/**
   * updates every data-index and index in the database of the respective element
   */
function updateIndices () {
  const items = document.querySelectorAll('.favname');
  items.forEach((item, index) => {
    item.setAttribute('data-index', index + 1);
    updateIndexInDatabase(item, index + 1);
  });
}
/**
   * removes every element in bookmarklist
   */
function clearBody () {
  while (bookmarkListBody.firstChild) {
    bookmarkListBody.removeChild(bookmarkListBody.firstChild);
  }
}
/**
   * updates index of item in database
   * @param {HTMLDivElement} item
   * @param {Number} index
   */
async function updateIndexInDatabase (item, index) {
  try {
    const name = item.firstElementChild.textContent;
    const data = { newIndex: index };
    const response = await fetch(`http://localhost:8080/bookmarklist/${name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Couldnt update index of Element');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
/**
   * copies name out of span into clipboard upon click
   * @param {Event} event
   */
function copyFunction (event) {
  const textElement = event.target.parentElement.parentElement.firstElementChild;
  navigator.clipboard.writeText(textElement.innerText);
}
/**
   * removes Element fav name upon click event
   * @param {Event} event
   */
function removeFunction (event) {
  const name = event.target.parentElement.parentElement.querySelector('span').innerHTML;
  removeByName(name);
}
/**
   * selects dragged Item and adds dragging as class, allows dragging functionality
   * if requested gender is at 'both' to not mess up indexes
   * @param {DragEvent} event
   */
function dragstartHandler (event) {
  if (requestGender === 'both') {
    draggedItem = event.target;
    draggedItem.classList.add('dragging');
  } else {
    event.preventDefault();
  }
}
/**
   *
   * @param {DragEvent} event
   */
function dragoverHandler (event) {
  event.preventDefault();
  const dropzoneElement = determineDropPosition(event.clientY);
  if (dropzoneElement == null) {
    bookmarkListBody.appendChild(draggedItem);
  } else {
    bookmarkListBody.insertBefore(draggedItem, dropzoneElement);
  }
}
/**
   *
   * @param {Number} coordy
   * @returns
   */
function determineDropPosition (coordy) {
  const listElements = [...document.querySelectorAll('.favname:not(.dragging)')];
  return listElements.reduce((cloestItem, listElement) => {
    const listElementBox = listElement.getBoundingClientRect();
    const currentItemOffset = coordy - (listElementBox.top + (listElementBox.height / 2));
    if (currentItemOffset < 0 && currentItemOffset > cloestItem.offset) {
      return { offset: currentItemOffset, element: listElement };
    } else {
      return cloestItem;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
/**
   *
   * @param {dragEndHandler} event
   */
function dragEndHandler (event) {
  draggedItem.classList.remove('dragging');
  updateIndices();
}

export function bookmarkList () {
  toggleButtons.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        requestGender = radio.value;
        clearBody();
        fillBody();
      }
    });
  });
  openButton.addEventListener('click', (event) => {
    fillBody();
  });
  bookmarkListBody.addEventListener('dragstart', dragstartHandler);
  bookmarkListBody.addEventListener('dragover', dragoverHandler);
  bookmarkListBody.addEventListener('dragend', dragEndHandler);
}

export function saveName () {
  const saveButtons = document.getElementsByClassName('save-name-button');
  [...saveButtons].forEach(button => {
    button.addEventListener('click', async (event) => {
      const nameContainer = event.currentTarget.parentElement;
      const name = nameContainer.getAttribute('id');
      if (await isNameBookmarked(name)) {
        removeByName(name);
      } else {
        await postName(name);
      }
      fillBody();
    });
  });
}

function removeByName (name) {
  deleteNameFromDB(name);
  markName(name, false);

  const bookmarkList = document.getElementById('bookmark-list');
  const spans = Array.from(bookmarkList.querySelectorAll('span'));
  const matchingSpan = spans.find(span => span.innerText === name);

  if (matchingSpan) {
    updateIndexInClientSide(matchingSpan.parentElement.getAttribute('data-index'));
    matchingSpan.parentElement.remove();
  }
}

async function postName (name) {
  markName(name, true);
  try {
    await fetch('http://localhost:8080/bookmarklist', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteNameFromDB (name) {
  try {
    await fetch(`http://localhost:8080/bookmarklist/${name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

async function updateIndexInClientSide (index) {
  const items = document.querySelectorAll('.favname');
  items.forEach((item) => {
    const curIndex = item.getAttribute('data-index');
    if (curIndex > index) {
      item.setAttribute('data-index', curIndex - 1);
      updateIndexInDatabase(item, curIndex - 1);
    }
  });
}
