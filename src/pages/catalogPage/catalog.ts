import { Brands, Flavors, InterfaceContainerElement } from '../../components/types/types';
import { createHTMLElement } from '../../utils/createHTMLElement';
import searchImgSrc from '../../assets/images/search.svg';
import Api from '../../components/api/api';
import Preloader from '../../components/preloader/preloader';
import backArrowImgSrc from '../../assets/images/back-arrow-white.png';
import mixerButtonImgSrc from '../../assets/images/blender.svg';
import { getFlavorsInMixer } from '../../utils/getFlavorsInMixer';
import { getImgSrc } from '../../utils/getImgUrl';
import { isDataInLocalStorage } from '../../utils/getAllData';

const ERROR_MESSAGE = 'К сожалению, по вашему запросу ничего не найдено...';
const MIXER_PAGE_URL = `/mixer`;
const BRAND_SUGGEST_URL = '/brand-suggest';

export class Catalog implements InterfaceContainerElement {
  api: Api;
  preloader: Preloader;
  brands: Brands = [];
  flavors: Flavors = [];
  constructor() {
    this.api = new Api();
    this.preloader = new Preloader();
    if (!isDataInLocalStorage()) return;
    const brandsInLS = localStorage.getItem('brands');
    this.brands = brandsInLS ? JSON.parse(brandsInLS) : [];
    const flavorsInLS = localStorage.getItem('flavors');
    this.flavors = flavorsInLS ? JSON.parse(flavorsInLS) : [];
  }
  draw() {
    document.querySelector('.result-container')?.remove();
    const catalog = createHTMLElement('catalog', 'div');
    catalog.appendChild(this.createHeader());
    catalog.appendChild(this.createSearchPanel());
    catalog.appendChild(this.createBrandSuggestBtn());
    this.createBrandList().then((catalogList) => catalog.appendChild(catalogList));
    return catalog;
  }

  private createHeader() {
    const header = createHTMLElement('catalog-header', 'div');
    header.appendChild(this.createHeaderBackBtn());
    header.appendChild(createHTMLElement('catalog__title', 'h2', 'Каталог'));
    header.appendChild(this.createHeaderMixerButton());
    return header;
  }

  private createHeaderBackBtn() {
    const backBtn = createHTMLElement('catalog__back-button', 'button');
    backBtn.style.backgroundImage = `url(${backArrowImgSrc})`;
    backBtn.onclick = () => (window.location.hash = MIXER_PAGE_URL);
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
    const searchPanel = createHTMLElement(['catalog__search', 'search'], 'div');
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

  private async handleKeyupOnInput(searchInput: HTMLInputElement) {
    if (this.brands.length === 0) return;
    console.log(this.brands);
    const sortedBrands = this.brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    const catalogList = document.querySelector('.catalog-list');
    if (!catalogList) return;
    catalogList.replaceWith(await this.createBrandList(sortedBrands));
  }

  private createBrandSuggestBtn() {
    const brandSuggestBtn = createHTMLElement('catalog__brand-suggest-btn', 'button', 'Нет нужного бренда? Жми сюда!');
    brandSuggestBtn.onclick = () => (window.location.hash = BRAND_SUGGEST_URL);
    return brandSuggestBtn;
  }

  private async createBrandList(brands?: Brands) {
    const catalogList = createHTMLElement('catalog-list', 'ul');
    if (brands?.length === 0) return this.showErrorMessage(catalogList);
    if (this.brands.length === 0) {
      this.preloader.draw();
      this.brands = await this.api.getAllBrands();
    }
    const brandsToIterate = brands ?? this.brands;
    for (let i = 0; i < brandsToIterate.length; i++) {
      catalogList.appendChild(await this.createBrandListItem(i, brandsToIterate));
    }
    this.preloader.removePreloader();
    return catalogList;
  }

  private showErrorMessage(catalogList: HTMLElement) {
    catalogList.append(ERROR_MESSAGE);
    catalogList.classList.add('catalog-list--error');
    return catalogList;
  }

  private async createBrandListItem(i: number, brands: Brands) {
    const brandListItem = createHTMLElement(['catalog-list__item', 'brands-list__item'], 'li');
    brandListItem.appendChild(this.createBrandImage(brands, i));
    brandListItem.appendChild(await this.createBrandNameAndFlavorsNum(brands, i));
    brandListItem.onclick = () => (window.location.hash += `/${brands[i].name.toLowerCase()}`);
    return brandListItem;
  }

  private createBrandImage(brands: Brands, i: number) {
    const brandImg = new Image();
    brandImg.src = getImgSrc(brands[i].image, this.api.getImage(brands[i].image));
    brandImg.alt = 'brand-name';
    return brandImg;
  }

  private async createBrandNameAndFlavorsNum(brands: Brands, i: number) {
    const container = createHTMLElement('catalog-list__item-container');
    const brandName = createHTMLElement('brand-name', 'span', brands[i].name);
    container.appendChild(brandName);
    if (this.flavors.length === 0) this.flavors = await this.api.getAllFlavors();
    const flavorsNum = createHTMLElement('flavors-count', 'span', this.getFlavorsNum(brands, i));
    container.appendChild(flavorsNum);
    return container;
  }

  private getFlavorsNum(brands: Brands, i: number) {
    return `${this.flavors.filter((flavor) => flavor.brand === brands[i].name).length} вкусов`;
  }
}
