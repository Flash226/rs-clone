import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement, Mixes, Rates } from '../types/types';
import backArrowImgSrc from '../../assets/images/back-arrow.png';
import { MixesList } from '../mixesList/mixesList';
import selectorImgSrc from '../../assets/images/selector-icon.png';
import expandArrowImgSrc from '../../assets/images/expand-arrow.png';
import Api from '../api/api';
import Preloader from '../preloader/preloader';
import ApiMix from '../api_mix/api_mix';

const SELECT_OPTIONS = ['Популярные', 'Новинки', 'Высокие рейтинги'];

export class UserMixes implements InterfaceContainerElement {
  mixes?: Mixes;
  rates?: Rates;
  api: Api;
  apiMix: ApiMix;
  preloader: Preloader;
  sortOption = 'популярные';
  constructor() {
    this.api = new Api();
    this.apiMix = new ApiMix();
    this.preloader = new Preloader();
  }
  draw() {
    const main = createHTMLElement('main', 'main');
    const container = createHTMLElement(['main__container', 'container']);
    main.appendChild(container);
    let UserMixesContainer;
    this.createUserMixesPopup().then((element) => {
      UserMixesContainer = element;
      container.appendChild(UserMixesContainer);
    });
    return main;
  }

  private async createUserMixesPopup() {
    const UserMixesContainer = createHTMLElement('user-mixes-container');
    UserMixesContainer.appendChild(this.createUserMixesPopupHeader());
    UserMixesContainer.appendChild(this.createUserMixesSelector());
    if (!this.mixes || !this.rates) {
      this.preloader.draw();
      this.mixes = await this.apiMix.getAllUsersMix();
      this.rates = await this.api.getAllRate();
      this.preloader.removePreloader();
    }
    const userMixesList = new MixesList(this.mixes, this.rates).create();
    UserMixesContainer.appendChild(userMixesList);
    return UserMixesContainer;
  }

  private createUserMixesPopupHeader() {
    const header = createHTMLElement('user-mixes__header');
    const navBar = createHTMLElement('user-mixes__nav', 'nav');
    const backArrowImage = new Image();
    backArrowImage.className = 'user-mixes__back-arrow';
    backArrowImage.src = backArrowImgSrc;
    backArrowImage.onclick = () => (location.hash = '#/');
    navBar.append(backArrowImage);
    header.append(navBar);
    const heading = createHTMLElement('user-mixes__heading', 'h4');
    heading.textContent = 'Миксы от пользователей';
    header.append(heading);
    return header;
  }

  private createUserMixesSelector() {
    const userMixesSelectorContainer = createHTMLElement('selector-container', 'div');
    const selectorImg = new Image();
    selectorImg.className = 'selector__image';
    selectorImg.src = selectorImgSrc;
    userMixesSelectorContainer.append(selectorImg);
    const container = createHTMLElement('selector__text-and-expand');
    const text = createHTMLElement('selector__text', 'span');
    text.textContent = SELECT_OPTIONS[0];
    container.appendChild(text);
    const expandArrowImg = new Image();
    expandArrowImg.className = 'selector__expand-image';
    expandArrowImg.src = expandArrowImgSrc;
    container.appendChild(expandArrowImg);
    userMixesSelectorContainer.appendChild(container);
    const selectorDropDown = createHTMLElement('selector', 'div');
    for (let i = 0; i < 3; i++) {
      selectorDropDown.appendChild(this.createSelectOption(i, text));
    }
    userMixesSelectorContainer.appendChild(selectorDropDown);
    userMixesSelectorContainer.onclick = (event) => this.handleClickOnSelector(event, selectorDropDown, expandArrowImg);
    return userMixesSelectorContainer;
  }

  private createSelectOption(i: number, text: HTMLElement) {
    const option = <HTMLLIElement>createHTMLElement('selector__option', 'li');
    option.textContent = SELECT_OPTIONS[i];
    if (i === 0) option.classList.add('selector__option--active');
    option.onclick = () => this.handleClickOnOption(option, text);
    return option;
  }

  private handleClickOnOption(clickedOption: HTMLLIElement, text: HTMLElement) {
    document.querySelectorAll('.selector__option').forEach((selector_option) => {
      selector_option.classList.remove('selector__option--active');
    });
    clickedOption.classList.add('selector__option--active');
    text.textContent = `${clickedOption.textContent}`;
    if (clickedOption.textContent) this.sortOption = clickedOption.textContent.toLowerCase();
    document.querySelector('.mixes-list')?.remove();
    document
      .querySelector('.user-mixes-container')
      ?.append(new MixesList(this.mixes, this.rates).create({ sortBy: this.sortOption }));
  }

  private handleClickOnSelector(event: MouseEvent, selectorDropDown: HTMLElement, expandArrowImg: HTMLImageElement) {
    if (event.target !== selectorDropDown && !(event.target as HTMLElement).classList.contains('selector__option')) {
      selectorDropDown.classList.toggle('selector--visible');
      expandArrowImg.classList.toggle('selector__expand-image--reverse');
    }
  }
}
