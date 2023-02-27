function initSlider() {
  const sliders = document.getElementsByClassName('tick-slider-input');

  for (const slider of sliders) {
    (<HTMLInputElement>slider).oninput = onSliderInput;

    updateValue(slider);
    updateValuePosition(slider);
    updateLabels(slider);
    updateProgress(slider);

    setTicks(slider);
  }
}

function onSliderInput(event: Event) {
  updateValue(event.target as HTMLInputElement);
  updateValuePosition(event.target as HTMLInputElement);
  updateLabels(event.target as HTMLInputElement);
  updateProgress(event.target as HTMLInputElement);
}

function onSliderChange(elem: HTMLInputElement) {
  updateValue(elem);
  updateValuePosition(elem);
  updateLabels(elem);
  updateProgress(elem);
}

function setMaxSliderLabel(maxLabel: number) {
  document.querySelectorAll('.tick-slider-label').forEach((elem, index) => {
    if (index % 2 !== 0) elem.innerHTML = String(maxLabel);
  });
}
function getMaxSliderValue() {
  let max = 100;
  if ((<HTMLInputElement>document.querySelector('#switch')).checked) {
    Array.from((<HTMLElement>document.querySelector('.mix-card__buttons-row')).children).forEach((elem) => {
      if (elem.classList.contains('active')) {
        max = Number(elem.innerHTML.replace(/\D/g, ''));
        setMaxSliderLabel(max);
      }
    });
    return max;
  } else {
    setMaxSliderLabel(max);
    return max;
  }
}

function updateValue(slider: Element) {
  const max = getMaxSliderValue();
  // console.log(max);
  if (max) {
    const value = document.getElementById((<HTMLInputElement>slider).dataset.valueId as string);
    if (max == 100)
      (<HTMLElement>value).innerHTML = '<div class="current-value">' + (<HTMLInputElement>slider).value + '%</div>';
    else {
      let roundValue = (Number((<HTMLInputElement>slider).value) * max) / 100;
      if (roundValue == 9.9) roundValue = Math.ceil(roundValue);
      else roundValue = Number(roundValue.toFixed(1));
      (<HTMLElement>value).innerHTML = '<div class="current-value">' + roundValue + ' г.</div>';
    }
  }
}

function updateValuePosition(slider: Element) {
  const value = document.getElementById((<HTMLInputElement>slider).dataset.valueId as string);

  const percent = getSliderPercent(slider);
  if (value !== null) {
    const sliderWidth = slider.getBoundingClientRect().width;
    const valueWidth = value.getBoundingClientRect().width;
    const handleSize = Number((<HTMLInputElement>slider).dataset.handleSize);

    let left = percent * (sliderWidth - handleSize) + handleSize / 2 - valueWidth / 2;

    left = Math.min(left, sliderWidth - valueWidth);
    left = (<HTMLInputElement>slider).value === (<HTMLInputElement>slider).min ? 0 : left;

    (<HTMLInputElement>value).style.left = left + 'px';
  }
}

function updateLabels(slider: Element) {
  const value = document.getElementById((<HTMLInputElement>slider).dataset.valueId as string);
  const minLabel = document.getElementById((<HTMLInputElement>slider).dataset.minLabelId as string);
  const maxLabel = document.getElementById((<HTMLInputElement>slider).dataset.maxLabelId as string);
  if (value && minLabel && maxLabel) {
    const valueRect = value.getBoundingClientRect();
    const minLabelRect = minLabel.getBoundingClientRect();
    const maxLabelRect = maxLabel.getBoundingClientRect();

    const minLabelDelta = valueRect.left - minLabelRect.left;
    const maxLabelDelta = maxLabelRect.left - valueRect.left;

    const deltaThreshold = 32;

    if (minLabelDelta < deltaThreshold) minLabel.classList.add('hidden');
    else minLabel.classList.remove('hidden');

    if (maxLabelDelta < deltaThreshold) maxLabel.classList.add('hidden');
    else maxLabel.classList.remove('hidden');
  }
}

function updateProgress(slider: Element) {
  const progress = document.getElementById((<HTMLInputElement>slider).dataset.progressId as string);
  const percent = getSliderPercent(slider);
  if (progress) progress.style.width = percent * 100 + '%';
}

function getSliderPercent(slider: Element) {
  const range = Number((<HTMLInputElement>slider).max) - Number((<HTMLInputElement>slider).min);
  const absValue = Number((<HTMLInputElement>slider).value) - Number((<HTMLInputElement>slider).min);

  return absValue / range;
}

function setTicks(slider: Element) {
  const container = document.getElementById((<HTMLInputElement>slider).dataset.tickId as string);
  const spacing = parseFloat((<HTMLInputElement>slider).dataset.tickStep as string);
  const sliderRange = Number((<HTMLInputElement>slider).max) - Number((<HTMLInputElement>slider).min);
  const tickCount = sliderRange / spacing + 1; // +1 to account for 0

  for (let ii = 0; ii < tickCount; ii++) {
    const tick = document.createElement('span');

    tick.className = 'tick-slider-tick';
    if (container) container.appendChild(tick);
  }
}

function onResizeSlider() {
  const sliders = document.getElementsByClassName('tick-slider-input');

  for (const slider of sliders) {
    updateValuePosition(slider);
  }
}
export { onResizeSlider };
export { initSlider };
export { onSliderChange };
