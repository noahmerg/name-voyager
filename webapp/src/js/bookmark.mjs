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
      clearBody();
      let response = null;
      if (requestGender === 'both') {
        response = await fetch('/bookmarklist');
      } else {
        response = await fetch(`/bookmarklist?gender=${requestGender}`);
      }
      const result = await response.json();
      result.forEach((value) => {
        const element = document.createElement('div');
        element.setAttribute('draggable', 'true');
        element.classList.add('favname');
        const text = document.createElement('span');
        text.textContent = value.name;
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('icon-container');
        const dragIconPath = './assets/drag_handle.svg';
        const copyIconPath = './assets/content_copy.svg';
        const deleteIconPath = './assets/delete.svg';
        const dragIcon = document.createElement('img');
        dragIcon.setAttribute('src', dragIconPath);
        dragIcon.setAttribute('alt', 'drag-icon');
        dragIcon.setAttribute('draggable', 'false');
        const copyIcon = document.createElement('img');
        copyIcon.setAttribute('src', copyIconPath);
        copyIcon.setAttribute('alt', 'drag-icon');
        copyIcon.setAttribute('draggable', 'false');
        const deleteIcon = document.createElement('img');
        deleteIcon.setAttribute('src', deleteIconPath);
        deleteIcon.setAttribute('alt', 'drag-icon');
        deleteIcon.setAttribute('draggable', 'false');
        element.appendChild(text);
        element.appendChild(iconContainer);
        iconContainer.appendChild(dragIcon);
        iconContainer.appendChild(copyIcon);
        iconContainer.appendChild(deleteIcon);
        bookmarkList.appendChild(element);
      });
    } catch (error) {
      console.log(error);
    }
  }
  function clearBody () {
    while (bookmarkList.firstChild) {
      bookmarkList.removeChild(bookmarkList.firstChild);
    }
  }
  function dragstartHandler (event) {
    draggedItem = event.target;
    draggedItem.classList.add('dragging');
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
  toggleButtons.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        requestGender = radio.value;
        fillBody();
      }
    });
  });
  button.addEventListener('click', fillBody());
  bookmarkList.addEventListener('dragstart', dragstartHandler);
  bookmarkList.addEventListener('dragover', dragoverHandler);
  bookmarkList.addEventListener('dragend', (event) => { draggedItem.classList.remove('dragging'); });
}
export function copyToClipboard () {
  function copyFunction (event) {
    const textElement = event.target.parentElement.parentElement.firstElementChild;
    console.log(textElement);
    navigator.clipboard.writeText(textElement.innerText);
  }
  const copyButtons = [...document.getElementsByClassName('copy-icon')];
  copyButtons.forEach((element) => element.addEventListener('click', copyFunction));
}
export function removeElement () {
  function removeFunction (event) {
    const element = event.target.parentElement.parentElement;
    element.remove();
  }
  const deleteButtons = [...document.getElementsByClassName('delete-icon')];
  deleteButtons.forEach((element) => element.addEventListener('click', removeFunction));
}
export function saveName () {
  const saveButtons = document.getElementsByClassName('save-name-button');
  [...saveButtons].forEach(button => {
    button.addEventListener('click', event => {
      const name = event.currentTarget.parentElement.getAttribute('id');
      console.log(name); // sonst meckert semistandard
      // add "name" to Bookm|arklist ID will always be the exact same as the name itself
    });
  });
}
