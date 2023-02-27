import { createHTMLElement } from '../../utils/createHTMLElement';
import { Mixes } from '../types/types';
import { MixesList } from '../mixesList/mixesList';

const PAGE_TITLE = 'Результаты';
const RESET_BTN_TEXT = 'Сбросить';

export class MixerNowResult {
  private mixes: Mixes;
  constructor(mixes: Mixes) {
    this.mixes = mixes;
  }
  create() {
    const resultContainer = createHTMLElement('result-container');
    resultContainer.appendChild(createHTMLElement('result__title', 'span', PAGE_TITLE));
    resultContainer.appendChild(this.createResultList());
    resultContainer.appendChild(this.createResetBtn());
    return resultContainer;
  }

  private createResultList() {
    const resultList = new MixesList(this.mixes).create();
    resultList.classList.add('result__list');
    return resultList;
  }

  private createResetBtn() {
    const resetButton = createHTMLElement('result__reset-btn', 'button', RESET_BTN_TEXT);
    resetButton.onclick = () => {
      localStorage.removeItem('flavorsInMixer');
      document.querySelector('.result-container')?.remove();
      location.hash = '#/';
    };
    return resetButton;
  }
}
