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
      // bookmarkList.style.display = 'flex';
    } else {
      bookmarkList.classList.remove('notOpen');
      bookmarkList.classList.add('open');
      buttonText.innerHTML = 'Close';
      // bookmarkList.style.display = 'none';
    }
  });
}
export function bookmarkList () {
  const bookmarkList = document.querySelector('.bookmark-body');
  let draggedItem = null;
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
      console.log(currentItemOffset);
      if (currentItemOffset < 0 && currentItemOffset > cloestItem.offset) {
        return { offset: currentItemOffset, element: listElement };
      } else {
        return cloestItem;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  bookmarkList.addEventListener('dragstart', dragstartHandler);
  bookmarkList.addEventListener('dragover', dragoverHandler);
  bookmarkList.addEventListener('dragend', (event) => { draggedItem.classList.remove('dragging'); });
}
