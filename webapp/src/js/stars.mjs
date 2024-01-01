
export function starMover () {
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  const img3 = document.getElementById('img3');
  const img4 = document.getElementById('img4');

  const imgw = img1.width;
  const imgh = img1.height;

  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

  window.onmousemove = e => {
    const left = (windowWidth * 0.4) + (e.clientX) * 0.2 - imgw / 2;
    const top = (windowHeight * 0.4) + (e.clientY) * 0.2 - imgh / 2;
    img1.style.left = `${left}px`;
    img1.style.top = `${top}px`;

    const left2 = (windowWidth * 0.35) + (e.clientX) * 0.3 - imgw / 2;
    const top2 = (windowHeight * 0.35) + (e.clientY) * 0.3 - imgh / 2;
    img2.style.left = `${left2}px`;
    img2.style.top = `${top2}px`;

    const left3 = (windowWidth * 0.25) + (e.clientX) * 0.5 - imgw / 2;
    const top3 = (windowHeight * 0.25) + (e.clientY) * 0.5 - imgh / 2;
    img3.style.left = `${left3}px`;
    img3.style.top = `${top3}px`;

    const left4 = (windowWidth * 0.3) + (e.clientX) * 0.4 - imgw / 2;
    const top4 = (windowHeight * 0.3) + (e.clientY) * 0.4 - imgh / 2;
    img4.style.left = `${left4}px`;
    img4.style.top = `${top4}px`;
  };
}
