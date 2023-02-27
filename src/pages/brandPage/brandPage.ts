import { createHTMLElement } from '../../utils/createHTMLElement';
import Api from '../../components/api/api';
import { Flavors, Flavor, InterfaceContainerElement } from '../../components/types/types';
import backArrowImgSrc from '../../assets/images/back-arrow-white.png';
import searchImgSrc from '../../assets/images/search.svg';
import infoImgSrc from '../../assets/images/info.svg';
import addNewImgSrc from '../../assets/images/add-new.png';
import Preloader from '../../components/preloader/preloader';
import { createPopup, openFlavorPopup } from '../../components/popup/popup';
import mixerButtonImgSrc from '../../assets/images/blender.svg';
import { getFlavorsInMixer } from '../../utils/getFlavorsInMixer';
import { changeFlavorNumInBrandPageHeader } from '../../utils/changeFlavorNum';

const ERROR_MESSAGE = 'К сожалению, по вашему запросу ничего не найдено...';
const SUGGEST_FLAVOR_HASH = '/flavor-suggest';
const SUGGEST_FLAVOR_BTN_TEXT = 'Добавить вкус';

export class BrandPage implements InterfaceContainerElement {
  private brand: string;
  private flavors: Flavors;
  api: Api;
  preloader: Preloader;
  constructor() {
    this.brand =
      decodeURI(window.location.hash.split('/')[1]) === 'create-new'
        ? decodeURI(window.location.hash.split('/')[4])
        : decodeURI(window.location.hash.split('/')[3]);
    this.api = new Api();
    this.preloader = new Preloader();
    const flavorsInLS = localStorage.getItem('flavors');
    if (!flavorsInLS) return;
    this.flavors = JSON.parse(flavorsInLS).filter(
      (flavor: Flavor) => flavor.brand.toLowerCase() === this.brand.toLowerCase()
    );
  }
  draw() {
    document.querySelector('.result-container')?.remove();
    const brandPage = createHTMLElement('brand-page');
    brandPage.appendChild(this.createHeader());
    brandPage.appendChild(this.createSearchPanel());
    brandPage.appendChild(this.createSuggestFlavorBtn());
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
    return this.brand
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
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
    if (flavorsInMixerNum !== 0) {
      mixerBtn.append(createHTMLElement('catalog__mixer-number', 'div', flavorsInMixerNum.toString()));
    }
    mixerBtn.onclick = () => {
      location.hash =
        decodeURI(window.location.hash.split('/')[1]) === 'create-new'
          ? '/create-new/mixer/mixer-now'
          : '/mixer/mixer-now';
    };
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

  private createSuggestFlavorBtn() {
    const addButton = <HTMLButtonElement>createHTMLElement('brand-page__add-btn', 'button', SUGGEST_FLAVOR_BTN_TEXT);
    addButton.onclick = () => (location.hash = SUGGEST_FLAVOR_HASH);
    return addButton;
  }

  private async createFlavorsList(flavors?: Flavors) {
    const flavorsList = createHTMLElement('flavor-list', 'ul');
    if (!this.flavors) await this.getAllFlavorsByBrand();
    if (flavors?.length === 0 || this.flavors.length === 0) return this.showErrorMessage(flavorsList);
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
      image.onclick = () => {
        const addButton = image.nextElementSibling ?? undefined;
        openFlavorPopup(flavor, addButton);
      };
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
    localStorage.setItem('flavorsInMixer', JSON.stringify(flavorsInMixer));
    changeFlavorNumInBrandPageHeader();
  }

  private async getAllFlavorsByBrand() {
    this.preloader.draw();
    this.flavors = (await this.api.getAllFlavors()).filter(
      (flavor) => flavor.brand.toLowerCase() === this.brand.toLowerCase()
    );
    this.preloader.removePreloader();
  }
}
