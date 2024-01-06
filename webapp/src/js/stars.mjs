export function starMover () {
  const images = document.querySelectorAll('.star-images');

  const imgw = images[0].width;
  const imgh = images[0].height;

  // choose one for each image: 0 < value < 1
  const imgSpeeds = [0.2, 0.3, 0.4, 0.5];

  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

  window.onmousemove = e => {
    for (let i = 0; i < 4; i++) {
      const imgSpeed = imgSpeeds[i];
      moveStar(e.clientX, e.clientY, images[i], (1 - imgSpeed) / 2, imgSpeed);
    }
  };

  function moveStar (posX, posY, img, factorX, factorY) {
    const left = windowWidth * factorX - posX * factorY - imgw / 2;
    const top = windowHeight * factorX - posY * factorY - imgh / 2;
    img.animate(
      {
        left: `${left}px`,
        top: `${top}px`
      },
      { duration: 45000, fill: 'both' }
    );
    // without animation:
    // img.style.left = `${left}px`;
    // img.style.top = `${top}px`;
  }
}
