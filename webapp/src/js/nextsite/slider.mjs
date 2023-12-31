// slider.js
export function initializeSlider () {
  const slider = document.getElementById('syllables-slider');
  const output = document.getElementById('syllables-legend');

  output.innerHTML = `Syllables: ${slider.value}`;

  slider.addEventListener('input', function () {
    output.innerHTML = `Syllables: ${this.value}`;
  });
}
