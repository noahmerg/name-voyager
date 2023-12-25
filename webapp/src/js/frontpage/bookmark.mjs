export function bookmarkPopup () {
  const bookmarkList = document.getElementById('bookmark-list');
  const button = document.getElementById('save-button');
  button.addEventListener('click', function () {
    if (bookmarkList.classList.contains('open')) {
      bookmarkList.classList.remove('open');
      bookmarkList.classList.add('notOpen');
      // bookmarkList.style.display = 'flex';
    } else {
      bookmarkList.classList.remove('notOpen');
      bookmarkList.classList.add('open');
      // bookmarkList.style.display = 'none';
    }
  });
}
