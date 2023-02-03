import { createHTMLElement } from '../../utils/createHTMLElement';
import {
  Brands,
  Flavors,
  FoundResults,
  InterfaceContainerElement,
  Mixes,
  TabBtnId,
  Tabs,
  SearchCategory,
} from '../../components/types/types';
import Api from '../../components/api/api';
import searchImgSrc from '../../assets/images/search.svg';
import ratingStarIconSrc from '../../assets/images/star-empty.svg';

const NOT_FOUND_ERROR = 'К сожалению, по данному запросу ничего не найдено.';

class SearchPage implements InterfaceContainerElement {
  private brands?: Brands;
  private flavors?: Flavors;
  private mixes?: Mixes;
  private api: Api;
  private foundResults?: FoundResults | null = null;

  constructor() {
    this.api = new Api();
  }

  draw(): HTMLElement {
    const main = createHTMLElement('main', 'main');
    const container = createHTMLElement(['main__container', 'container']);
    main.appendChild(container);
    const searchInput = this.createSearchPanel();
    container.appendChild(searchInput);
    return main;
  }

  private createSearchPanel() {
    const searchPanelContainer = createHTMLElement('search', 'div');
    const innerSearchPanelContainer = createHTMLElement('search__inner', 'div');
    const image = new Image();
    image.src = searchImgSrc;
    image.alt = 'search';
    innerSearchPanelContainer.appendChild(image);
    const searchInput = <HTMLInputElement>createHTMLElement('search__input', 'input');
    searchInput.placeholder = 'Бренд, микс, вкус';
    searchInput.onkeydown = (event) => this.handleInput(event);
    innerSearchPanelContainer.appendChild(searchInput);
    searchPanelContainer.appendChild(innerSearchPanelContainer);
    return searchPanelContainer;
  }

  private createSearchTabs() {
    const searchTabs = createHTMLElement('tabs', 'div');
    for (let i = 1; i <= 4; i++) {
      const input = <HTMLInputElement>createHTMLElement('', 'input');
      input.type = 'radio';
      input.name = 'tab=btn';
      input.id = `tab-btn-${i}`;
      input.value = Tabs[i];
      if (i === 1) input.checked = true;
      if (i === 4) input.disabled = true;
      const label = <HTMLLabelElement>createHTMLElement('', 'label');
      label.htmlFor = `tab-btn-${i}`;
      label.textContent = Tabs[i];
      searchTabs.appendChild(input);
      searchTabs.appendChild(label);
      input.onclick = () => {
        const container = document.querySelector('.main__container');
        if (!container) return;
        container.appendChild(this.createListOfResults(input.id as TabBtnId));
      };
    }
    return searchTabs;
  }

  private createListOfResults(tabBtnId: TabBtnId) {
    const listInTheDOM = document.querySelector('.search-list');
    if (listInTheDOM) listInTheDOM.remove();
    const list = createHTMLElement('search-list', 'ul');
    if (!this.foundResults) return showErrorMessage();
    let resultByTab;
    if (tabBtnId === 'tab-btn-1') {
      resultByTab = this.foundResults.foundFlavors;
      if (!resultByTab) return showErrorMessage();
      this.createResultListForFlavorTab(resultByTab, list);
    } else if (tabBtnId === 'tab-btn-2') {
      resultByTab = this.foundResults.foundMixes;
      if (!resultByTab) return showErrorMessage();
      this.createResultListForMixesTab(resultByTab, list);
    } else if (tabBtnId === 'tab-btn-3') {
      resultByTab = this.foundResults.foundBrands;
      if (!resultByTab) return showErrorMessage();
      this.createResultListForBrandTab(resultByTab, list);
    }
    return list;

    function showErrorMessage() {
      list.classList.add('search-list--error-message');
      list.textContent = NOT_FOUND_ERROR;
      return list;
    }
  }

  private createResultListForFlavorTab(resultByTab: Flavors, list: HTMLElement) {
    list.classList.add('flavors-list');
    for (let i = 0; i < resultByTab.length; i++) {
      const listItem = createHTMLElement('flavors-list__item', 'li');
      const brandName = createHTMLElement('brand-name', 'span');
      brandName.textContent = resultByTab[i].brand;
      listItem.appendChild(brandName);
      const flavorName = createHTMLElement('flavor-name', 'span');
      flavorName.textContent = resultByTab[i].name;
      listItem.appendChild(flavorName);
      list.appendChild(listItem);
      listItem.onclick = () => this.openFlavorCard();
    }
  }

  private openFlavorCard() {
    /* TO-DO */
  }

  private createResultListForMixesTab(resultByTab: Mixes, list: HTMLElement) {
    list.classList.add('mixes-list');
    for (let i = 0; i < resultByTab.length; i++) {
      const listItem = createHTMLElement('mixes-list__card', 'li');
      const mixImg = <HTMLImageElement>createHTMLElement('mixes-list__card-img', 'img');
      mixImg.src = this.api.getImage(resultByTab[i].image);
      listItem.appendChild(mixImg);
      const container = createHTMLElement('mixes-list__card-container');
      const mixTitle = createHTMLElement('mixes-list__title', 'span');
      mixTitle.textContent = resultByTab[i].name;
      container.appendChild(mixTitle);
      const listItemFooter = createHTMLElement('mixes-list__card-footer');
      const button = createHTMLElement(['mixes-list__button', 'button-1'], 'button');
      button.textContent = 'Попробовать';
      listItemFooter.appendChild(button);
      const ratingContainer = createHTMLElement('mixes-list__rating-container');
      const ratingStarIcon = <HTMLImageElement>createHTMLElement('mixes-list__rating-icon', 'img');
      ratingStarIcon.src = ratingStarIconSrc;
      ratingContainer.appendChild(ratingStarIcon);
      const ratingNum = createHTMLElement('mixes-list__rating-num', 'span');
      /* добавить в БД рейтинг миксам */
      ratingNum.innerText = '5.0';
      ratingContainer.appendChild(ratingNum);
      listItemFooter.appendChild(ratingContainer);
      container.appendChild(listItemFooter);
      listItem.appendChild(container);
      list.appendChild(listItem);
      listItem.onclick = () => this.openMixCard();
    }
  }

  private openMixCard() {
    /* TO-DO */
  }

  private createResultListForBrandTab(resultByTab: Brands, list: HTMLElement) {
    list.classList.add('brands-list');
    for (let i = 0; i < resultByTab.length; i++) {
      const listItem = createHTMLElement('brands-list__item', 'li');
      const brandImg = new Image();
      brandImg.src = this.api.getImage(resultByTab[i].image);
      brandImg.alt = 'brand-name';
      listItem.appendChild(brandImg);
      const container = createHTMLElement('brands-list__item-container');
      const brandName = createHTMLElement('brand-name', 'span');
      brandName.textContent = resultByTab[i].name;
      container.appendChild(brandName);
      const flavorsNum = createHTMLElement('flavors-count', 'span');
      if (!this.flavors) return;
      flavorsNum.textContent = `${this.flavors.filter((flavor) => flavor.brand === resultByTab[i].name).length} вкусов`;
      container.appendChild(flavorsNum);
      listItem.appendChild(container);
      list.appendChild(listItem);
      listItem.onclick = () => this.openBrandCard();
    }
  }

  private openBrandCard() {
    /* TO-DO */
    /* открывается страница миксер => бренд */
  }

  private searchBy(inputValue: string, category: SearchCategory) {
    const property = this[`${category}`];
    if (!property) return;
    const searchedValue = inputValue.trim().toLowerCase();
    if (searchedValue.length === 0) return;
    const filteredArr = property.filter((elem) => elem.name.toLowerCase().includes(searchedValue));
    return filteredArr.length > 0 ? filteredArr : null;
  }

  private searchByAll(inputValue: string): FoundResults {
    const foundFlavors = <Flavors | null>this.searchBy(inputValue, 'flavors');
    const foundMixes = <Mixes | null>this.searchBy(inputValue, 'mixes');
    const foundBrands = <Brands | null>this.searchBy(inputValue, 'brands');
    return {
      foundFlavors,
      foundMixes,
      foundBrands,
    };
  }

  private async checkDataBase() {
    if (this.brands && this.flavors && this.mixes) return;
    /* TO-DO: spinner-ON */ console.log('Start of the search...');
    this.brands = await this.api.getAllBrands();
    this.flavors = await this.api.getAllFlavors();
    this.mixes = await this.api.getAllMixes();
    /* spinner-OFF */ console.log('End of the search...');
  }

  private async handleInput(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    await this.checkDataBase();
    const result = this.searchByAll(input.value);
    this.foundResults = result;
    this.showSearchResults();
  }

  private showSearchResults() {
    const container = document.querySelector('.main__container');
    if (!container) return;
    const tabsInTheDOM = document.querySelector('.tabs');
    if (!tabsInTheDOM) container.appendChild(this.createSearchTabs());
    const tabs = document.querySelector('.tabs');
    if (!tabs) return;
    tabs.childNodes.forEach((tab) => {
      if (!(tab instanceof HTMLInputElement)) return;
      tab.checked === true ? tab.click() : false;
    });
  }
}

export default SearchPage;
