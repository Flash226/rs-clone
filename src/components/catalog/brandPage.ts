import { createHTMLElement } from '../../utils/createHTMLElement';
import Api from '../api/api';
import { Flavors, Flavor, InterfaceContainerElement } from '../types/types';
import backArrowImgSrc from '../../assets/images/back-arrow-white.png';
import searchImgSrc from '../../assets/images/search.svg';
import infoImgSrc from '../../assets/images/info.svg';
import addNewImgSrc from '../../assets/images/add-new.png';
import preloader from '../preloader/preloader';
import { createPopup, openFlavorPopup } from '../popup/popup';
import mixerButtonImgSrc from '../../assets/images/blender.svg';
import { getFlavorsInMixer } from '../../utils/getFlavorsInMixer';

const ERROR_MESSAGE = 'К сожалению, по вашему запросу ничего не найдено...';

export class BrandPage implements InterfaceContainerElement {
  private brand: string;
  private flavors: Flavors;
  api: Api;
  preloader: preloader;
  constructor() {
    this.brand = window.location.hash.split('/')[3];
    this.brand = this.brand.replace('%20', ' ');
    this.api = new Api();
    this.preloader = new preloader();
  }
  draw() {
    const brandPage = createHTMLElement('brand-page');
    brandPage.appendChild(this.createHeader());
    brandPage.appendChild(this.createSearchPanel());
    this.createFlavorsList().then((element) => brandPage.appendChild(element));
    createPopup(brandPage);
    return brandPage;
  }

  private createHeader() {
    const header = createHTMLElement('brand-page-header', 'div');
    header.appendChild(this.createHeaderBackBtn());
    header.appendChild(createHTMLElement('brand-page__title', 'h2', this.getBrandName()));
    header.appendChild(this.createHeaderMixerButton());
    return header;
  }

  private getBrandName() {
    return this.brand[0].toUpperCase() + this.brand.slice(1);
  }

  private createHeaderBackBtn() {
    const backBtn = createHTMLElement('brand__back-button', 'button');
    backBtn.style.backgroundImage = `url(${backArrowImgSrc})`;
    backBtn.onclick = () => history.back();
    return backBtn;
  }

  private createHeaderMixerButton() {
    const mixerBtn = createHTMLElement('catalog__mixer-image', 'button');
    mixerBtn.style.backgroundImage = `url(${mixerButtonImgSrc})`;
    const flavorsInMixerNum = getFlavorsInMixer().length;
    console.log(flavorsInMixerNum);
    if (flavorsInMixerNum !== 0) {
      mixerBtn.append(createHTMLElement('catalog__mixer-number', 'div', flavorsInMixerNum.toString()));
    }
    return mixerBtn;
  }

  private createSearchPanel() {
    const searchPanel = createHTMLElement(['brand-page__search', 'search'], 'div');
    const innerSearchPanelContainer = createHTMLElement('search__inner', 'div');
    innerSearchPanelContainer.appendChild(this.createSearchInputImage());
    innerSearchPanelContainer.appendChild(this.createSearchInput());
    searchPanel.appendChild(innerSearchPanelContainer);
    return searchPanel;
  }

  private createSearchInputImage() {
    const image = new Image();
    image.src = searchImgSrc;
    image.alt = 'search';
    return image;
  }

  private createSearchInput() {
    const searchInput = <HTMLInputElement>createHTMLElement('search__input', 'input');
    searchInput.placeholder = 'Поиск';
    searchInput.onkeyup = () => this.handleKeyupOnInput(searchInput);
    return searchInput;
  }

  private async handleKeyupOnInput(input: HTMLInputElement) {
    const sortedFlavors = this.flavors.filter((flavor) =>
      flavor.name.toLowerCase().includes(input.value.toLowerCase())
    );
    const flavorsList = document.querySelector('.flavor-list');
    if (!flavorsList) return;
    flavorsList.replaceWith(await this.createFlavorsList(sortedFlavors));
  }

  private async createFlavorsList(flavors?: Flavors) {
    const flavorsList = createHTMLElement('flavor-list', 'ul');
    if (flavors?.length === 0) return this.showErrorMessage(flavorsList);
    if (!this.flavors) await this.getAllFlavorsByBrand();
    const flavorsToIterate = flavors ?? this.flavors;
    for (let i = 0; i < flavorsToIterate.length; i++) {
      flavorsList.appendChild(this.createFlavorListItem(i, flavorsToIterate));
    }
    return flavorsList;
  }

  private showErrorMessage(flavorsList: HTMLElement) {
    flavorsList.append(ERROR_MESSAGE);
    flavorsList.classList.add('catalog-list--error');
    return flavorsList;
  }

  private createFlavorListItem(i: number, flavors: Flavors) {
    const flavorListItem = createHTMLElement('flavor-list__item', 'li');
    flavorListItem.appendChild(createHTMLElement('flavor__name', 'span', flavors[i].name));
    flavorListItem.appendChild(this.createImage('flavor__image--info', infoImgSrc, flavors[i]));
    flavorListItem.appendChild(this.createImage('flavor__image--add-new', addNewImgSrc, flavors[i]));
    return flavorListItem;
  }

  private createImage(className: string, src: string, flavor?: Flavor) {
    const image = new Image();
    image.className = className;
    image.src = src;
    if (className === 'flavor__image--info') {
      if (!flavor) return image;
      image.onclick = () => openFlavorPopup(flavor);
    } else if (className === 'flavor__image--add-new') {
      if (!flavor) return image;
      if (this.isFlavorInMixer(flavor)) image.classList.add('flavor__image--added');
      image.onclick = () => this.handleClickOnAddButton(image, flavor);
    }
    return image;
  }

  private isFlavorInMixer(flavor: Flavor) {
    const flavorsInMixer = getFlavorsInMixer();
    const index = flavorsInMixer.findIndex((flavorInMixer) => flavorInMixer.id === flavor.id);
    return index !== -1;
  }

  private handleClickOnAddButton(image: HTMLImageElement, flavor: Flavor) {
    image.classList.toggle('flavor__image--added');
    const flavorsInMixer = getFlavorsInMixer();
    const indexOfFlavorInMixer = flavorsInMixer.findIndex((flavorInMixer) => flavorInMixer.id === flavor.id);
    if (image.classList.contains('flavor__image--added') && indexOfFlavorInMixer === -1) flavorsInMixer.push(flavor);
    else flavorsInMixer.splice(indexOfFlavorInMixer, 1);
    localStorage.setItem('flavors', JSON.stringify(flavorsInMixer));
    const mixerImage = document.querySelector('.catalog__mixer-image');
    if (!mixerImage) return;
    mixerImage.replaceWith(this.createHeaderMixerButton());
  }

  private async getAllFlavorsByBrand() {
    this.preloader.draw();
    this.flavors = (await this.api.getAllFlavors()).filter(
      (flavor) => flavor.brand.toLowerCase() === this.brand.toLowerCase()
    );
    this.preloader.removePreloader();
  }
}
