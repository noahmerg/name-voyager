export function starMover () {
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  const img3 = document.getElementById('img3');
  const img4 = document.getElementById('img4');

  const imgw = img1.width;
  const imgh = img1.height;

  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

  window.onmousemove = e => {
    const moveStar = (img, factorX, factorY) => {
      const left = windowWidth * factorX + e.clientX * factorY - imgw / 2;
      const top = windowHeight * factorX + e.clientY * factorY - imgh / 2;
      img.style.left = `${left}px`;
      img.style.top = `${top}px`;
    };

    moveStar(img1, 0.4, 0.2);
    moveStar(img2, 0.35, 0.3);
    moveStar(img3, 0.25, 0.5);
    moveStar(img4, 0.3, 0.4);
  };
}
