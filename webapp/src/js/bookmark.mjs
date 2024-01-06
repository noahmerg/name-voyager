export function bookmarkPopup () {
  const bookmarkList = document.getElementById('bookmark-list');
  const button = document.getElementById('save-button');
  const buttonText = button.children[0].children[0];
  // const buttonSymbol = button.children[0].children[1];
  button.addEventListener('click', function () {
    if (bookmarkList.classList.contains('open')) {
      bookmarkList.classList.remove('open');
      bookmarkList.classList.add('notOpen');
      buttonText.innerHTML = 'Bookmarks';
      // beim öffnen der Bookliste hier eine Funktion machen, die eine Anfrage erstellt und dann die
      // jeweiligen Elemente erstellt
    } else {
      bookmarkList.classList.remove('notOpen');
      bookmarkList.classList.add('open');
      buttonText.innerHTML = 'Close';
    }
  });
}

export function bookmarkList () {
  const bookmarkList = document.querySelector('.bookmark-body');
  const toggleButtons = document.querySelectorAll('input[name="gender-toggle"]');
  // const orderedList = [...bookmarkList.children].map((element, index)=>{return {element:element,index:index}});
  let draggedItem = null;
  let requestGender = 'both';
  const button = document.getElementById('save-button');
  async function fillBody () {
    try {
      let response = null;
      console.log(requestGender);
      if (requestGender === 'both') {
        response = await fetch('http://localhost:8080/bookmarklist');
      } else {
        response = await fetch(`http://localhost:8080/bookmarklist?gender=${requestGender}`);
      }
      const result = await response.json();
      result.forEach((value) => {
        const exists = Array.from(bookmarkList.getElementsByClassName('favname')).some(el => el.textContent.includes(value.name));
        if (!exists) {
          const element = createFavNameElement(value);
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
          bookmarkList.appendChild(element);
        }
      });
    } catch (error) {
      console.log(error);
    }

    function createIconContainer () {
      const iconContainer = document.createElement('div');
      iconContainer.classList.add('icon-container');
      return iconContainer;
    }

    function createNameText (value) {
      const text = document.createElement('span');
      text.textContent = value.name;
      return text;
    }

    function createFavNameElement (value) {
      const element = document.createElement('div');
      element.setAttribute('draggable', 'true');
      element.classList.add('favname');
      element.setAttribute('data-index', `${value.index}`);
      return element;
    }

    function createDeleteIcon (deleteIconPath) {
      const deleteIcon = document.createElement('img');
      deleteIcon.setAttribute('src', deleteIconPath);
      deleteIcon.setAttribute('alt', 'drag-icon');
      deleteIcon.setAttribute('draggable', 'false');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.addEventListener('click', removeFunction);
      return deleteIcon;
    }

    function createDragIcon (dragIconPath) {
      const dragIcon = document.createElement('img');
      dragIcon.setAttribute('src', dragIconPath);
      dragIcon.setAttribute('alt', 'drag-icon');
      dragIcon.setAttribute('draggable', 'false');
      dragIcon.classList.add('drag-icon');
      return dragIcon;
    }

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
  function updateIndices () {
    const items = document.querySelectorAll('.favname');
    items.forEach((item, index) => {
      item.setAttribute('data-index', index + 1);
      updateIndexInDatabase(item, index + 1);
    });
  }
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
      console.log('hallo');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  function clearBody () {
    while (bookmarkList.firstChild) {
      bookmarkList.removeChild(bookmarkList.firstChild);
    }
  }
  function dragstartHandler (event) {
    if (requestGender === 'both') {
      draggedItem = event.target;
      draggedItem.classList.add('dragging');
    } else {
      event.preventDefault();
    }
  }
  function dragoverHandler (event) {
    event.preventDefault();
    const dropzoneElement = determineDropPosition(event.clientY);
    if (dropzoneElement == null) {
      bookmarkList.appendChild(draggedItem);
    } else {
      bookmarkList.insertBefore(draggedItem, dropzoneElement);
    }
  }
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
  function dragEndHandler (event) {
    draggedItem.classList.remove('dragging');
    updateIndices();
  }
  toggleButtons.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        requestGender = radio.value;
        clearBody();
        fillBody();
      }
    });
  });
  button.addEventListener('click', (event) => {
    fillBody();
  });
  bookmarkList.addEventListener('dragstart', dragstartHandler);
  bookmarkList.addEventListener('dragover', dragoverHandler);
  bookmarkList.addEventListener('dragend', dragEndHandler);
}
function copyFunction (event) {
  const textElement = event.target.parentElement.parentElement.firstElementChild;
  console.log(textElement);
  navigator.clipboard.writeText(textElement.innerText);
}
function removeFunction (event) {
  const element = event.target.parentElement.parentElement;
  element.remove();
}
export function saveName () {
  const saveButtons = document.getElementsByClassName('save-name-button');
  [...saveButtons].forEach(button => {
    button.addEventListener('click', event => {
      const name = event.currentTarget.parentElement.getAttribute('id');
      postName(name); // POST request to server to save name in datab
    });
  });
  async function postName (name) {
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
}
