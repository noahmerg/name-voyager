// slider.js
export function initializeSlider () {
  const slider = document.getElementById('syllables-slider');
  const output = document.getElementById('syllables-legend');

  const nameslider = document.getElementById('numOfNames-slider');
  const nameoutput = document.getElementById('numOfNames-legend');

  output.innerHTML = `Syllables: ${slider.value}`;
  nameoutput.innerHTML = `Number of Names per Page: ${nameslider.value}`;

  slider.addEventListener('input', function () {
    output.innerHTML = `Syllables: ${this.value}`;
  });

  nameslider.addEventListener('input', function () {
    nameoutput.innerHTML = `Number of Names per Page: ${this.value}`;
  });
}
