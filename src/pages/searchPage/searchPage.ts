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
  Mix,
  Flavor,
  Brand,
  TabBtnIds,
  Preferences,
} from '../../components/types/types';
import Api from '../../components/api/api';
import searchImgSrc from '../../assets/images/search.svg';
import {
  sortBrandsByPreferences,
  sortFlavorsByPreferences,
  sortFlavorsByStrengthPref,
  sortFoundBrandResultsByTheStringStart,
  sortFoundFlavorResultsByTheStringStart,
  sortFoundMixResultsByTheStringStart,
} from '../../utils/sortFoundResults';
import { MixesList } from '../../components/mixesList/mixesList';
import { createPopup, openFlavorPopup } from '../../components/popup/popup';
import Preloader from '../../components/preloader/preloader';
import { getImgSrc } from '../../utils/getImgUrl';
import ApiUsers from '../../components/api_users/apiUsers';
import { getDataFromLS } from '../../utils/getAllData';
import { isPreferencesType } from '../../utils/isPreferencesType';
import ApiMix from '../../components/api_mix/api_mix';
import headerChange from '../../components/headerChange/headerChange';
import { handleChangeOfFlavorsInMixer } from '../../utils/changeFlavorNum';

const NOT_FOUND_ERROR = 'К сожалению, по данному запросу ничего не найдено.';
const POPULAR_QUERIES_PLACEHOLDER = ['малина', 'клубника', 'травяной', 'фруктовый', 'ягодный'];
const POPULAR_QUERIES_TITLE = 'Популярные запросы';
const SEARCH_INPUT_PLACEHOLDER = 'Бренд, микс, вкус';
const TABS_NUM = 3;
const SHORTENED_WORD_LENGTH = 4;

class SearchPage implements InterfaceContainerElement {
  private brands?: Brands;
  private flavors?: Flavors;
  private mixes?: Mixes;
  private api: Api;
  private apiMix: ApiMix;
  private foundResults?: FoundResults | null = null;
  private suggestions: string[] = [];
  private preloader: Preloader;
  private apiUsers: ApiUsers;
  private popularQueries: string[];
  private preferences?: Preferences;

  constructor() {
    this.api = new Api();
    this.apiMix = new ApiMix();
    this.checkDataBase();
    this.apiUsers = new ApiUsers();
    this.preloader = new Preloader();
  }

  draw(): HTMLElement {
    const main = createHTMLElement('main', 'main');
    const container = createHTMLElement('search__container');
    main.appendChild(container);
    container.appendChild(this.createSearchPanel());
    container.appendChild(this.createAsidePanel());
    createPopup(main);
    const button = document.createElement('button');
    button.id = 'mixer-now';
    button.className = 'main__mixer';
    button.onclick = () => {
      location.hash = '/mixer/mixer-now';
    };
    main.appendChild(button);
    headerChange(`Поиск`);
    setTimeout(() => {
      handleChangeOfFlavorsInMixer();
    }, 0);
    return main;
  }

  private createAsidePanel() {
    const asidePanel = createHTMLElement('search-aside', 'aside');
    this.createPopularQueriesContainer().then((element) => asidePanel.appendChild(element));
    return asidePanel;
  }

  private async createPopularQueriesContainer() {
    const popularQueriesContainer = createHTMLElement('queries');
    const popularQueries: string[] = getDataFromLS('popularQueries') ?? POPULAR_QUERIES_PLACEHOLDER;
    popularQueriesContainer.appendChild(createHTMLElement('queries__title', 'h3', POPULAR_QUERIES_TITLE));
    popularQueriesContainer.appendChild(this.createPopularQueriesBtns(popularQueries));
    return popularQueriesContainer;
  }

  private createPopularQueriesBtns(popularQueries: string[]) {
    const buttons = createHTMLElement('queries-buttons');
    for (let i = 0; i < popularQueries.length; i++) {
      buttons.appendChild(this.createSinglePopularQuery(i, popularQueries));
    }
    return buttons;
  }

  private createSinglePopularQuery(i: number, POPULAR_QUERIES: string[]) {
    const button = <HTMLButtonElement>(
      createHTMLElement('queries-buttons__button', 'button', POPULAR_QUERIES[i].toUpperCase())
    );
    button.onclick = () => this.handleClickOnQueryButton(button);
    return button;
  }

  private handleClickOnQueryButton(button: HTMLButtonElement) {
    document.querySelector('.search-aside')?.classList.add('search-aside--hidden');
    const input = document.querySelector('.search__input');
    if (!(input instanceof HTMLInputElement)) return;
    input.value = button.textContent?.toLowerCase() ?? '';
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
  }

  private createSearchPanel() {
    const searchPanelContainer = createHTMLElement('search', 'div');
    searchPanelContainer.appendChild(this.createInnerSearchPanelContainer());
    return searchPanelContainer;
  }

  private createSearchInput() {
    const searchInput = <HTMLInputElement>createHTMLElement('search__input', 'input');
    searchInput.placeholder = SEARCH_INPUT_PLACEHOLDER;
    searchInput.onkeyup = (event) => this.handleInputSumbit(event, searchInput);
    return searchInput;
  }

  private createInnerSearchPanelContainer() {
    const innerSearchPanelContainer = createHTMLElement('search__inner', 'div');
    const image = new Image();
    image.src = searchImgSrc;
    image.alt = 'search';
    innerSearchPanelContainer.appendChild(image);
    innerSearchPanelContainer.appendChild(this.createSearchInput());
    return innerSearchPanelContainer;
  }

  private createSearchTabs() {
    const searchTabs = createHTMLElement('tabs', 'div');
    for (let i = 1; i <= TABS_NUM; i++) {
      searchTabs.appendChild(this.createSearchTab(i));
      searchTabs.appendChild(this.createTabLabel(i));
    }
    return searchTabs;
  }

  private createTabLabel(i: number) {
    const label = <HTMLLabelElement>createHTMLElement('', 'label');
    label.htmlFor = `tab-btn-${i}`;
    label.textContent = Tabs[i];
    return label;
  }

  private createSearchTab(i: number) {
    const tab = <HTMLInputElement>createHTMLElement('', 'input');
    tab.type = 'radio';
    tab.name = 'tab=btn';
    tab.id = `tab-btn-${i}`;
    tab.value = Tabs[i];
    if (i === 1) tab.checked = true;
    tab.onclick = () => this.handleClickOnTab(tab.id as TabBtnId);
    return tab;
  }

  private handleClickOnTab(tabId: TabBtnId) {
    const container = document.querySelector('.search__container');
    if (!container) return;
    container.appendChild(this.createListOfResults(tabId));
  }

  private createListOfResults(tabBtnId: TabBtnId) {
    document.querySelector('.search-list')?.remove();
    document.querySelector('.search-error-message')?.remove();
    if (!this.foundResults) return showErrorMessage();
    let resultByTab;
    if (tabBtnId === TabBtnIds[1]) {
      resultByTab = this.foundResults.foundFlavors;
      if (!resultByTab) return showErrorMessage();
      return this.createResultListForFlavorTab(resultByTab);
    } else if (tabBtnId === TabBtnIds[2]) {
      resultByTab = this.foundResults.foundMixes;
      if (!resultByTab) return showErrorMessage();
      return this.createResultListForMixesTab(resultByTab);
    } else if (tabBtnId === TabBtnIds[3]) {
      resultByTab = this.foundResults.foundBrands;
      if (!resultByTab) return showErrorMessage();
      return this.createResultListForBrandTab(resultByTab);
    }
    return showErrorMessage();

    function showErrorMessage() {
      const errorMessage = createHTMLElement('search-error-message');
      errorMessage.textContent = NOT_FOUND_ERROR;
      return errorMessage;
    }
  }

  private createResultListForFlavorTab(resultByTab: Flavors) {
    let flavorsToIterate: Flavors = resultByTab;
    if (this.preferences) {
      const preferredFlavors = this.preferences?.flavors;
      flavorsToIterate = resultByTab.sort((flavor1, flavor2) =>
        sortFlavorsByPreferences(flavor1, flavor2, preferredFlavors)
      );
      const preferredStrength = this.preferences.strange;
      flavorsToIterate = flavorsToIterate.sort((flavor1, flavor2) =>
        sortFlavorsByStrengthPref(flavor1, flavor2, preferredStrength)
      );
    }
    const list = createHTMLElement('search-list', 'ul');
    list.classList.add('flavors-list');
    for (let i = 0; i < flavorsToIterate.length; i++) {
      list.appendChild(this.createListItemForFlavorTab(resultByTab, i));
    }
    return list;
  }

  private createListItemForFlavorTab(resultByTab: Flavors, i: number) {
    const listItem = createHTMLElement('flavors-list__item', 'li');
    listItem.appendChild(createHTMLElement('brand-name', 'span', resultByTab[i].brand));
    listItem.appendChild(createHTMLElement('flavor-name', 'span', resultByTab[i].name));
    listItem.onclick = () => openFlavorPopup(resultByTab[i]);
    return listItem;
  }

  private createResultListForMixesTab(resultByTab: Mixes) {
    return new MixesList(resultByTab).create({ isSearchList: true });
  }

  private createResultListForBrandTab(resultByTab: Brands) {
    let brandsToIterate: Brands = resultByTab;
    if (this.preferences) {
      brandsToIterate = resultByTab.sort((brand1, brand2) =>
        sortBrandsByPreferences(brand1, brand2, (this.preferences as Preferences).brands)
      );
    }
    const list = createHTMLElement('search-list', 'ul');
    list.classList.add('brands-list');
    if (!this.flavors) return list;
    for (let i = 0; i < brandsToIterate.length; i++) list.appendChild(this.createListItemForBrandTab(resultByTab, i));
    return list;
  }

  private createListItemForBrandTab(resultByTab: Brands, i: number) {
    const listItem = createHTMLElement('brands-list__item', 'li');
    const brandImg = new Image();
    brandImg.src = getImgSrc(resultByTab[i].image, this.api.getImage(resultByTab[i].image));
    brandImg.alt = 'brand-name';
    listItem.appendChild(brandImg);
    const container = createHTMLElement('brands-list__item-container');
    container.appendChild(createHTMLElement('brand-name', 'span', resultByTab[i].name));
    container.appendChild(
      createHTMLElement('flavors-count', 'span', this.getFlavorsNum(resultByTab, i, this.flavors as Flavors))
    );
    listItem.appendChild(container);
    listItem.onclick = () => this.openBrandCard(resultByTab[i].name);
    return listItem;
  }

  private getFlavorsNum(resultByTab: Brands, i: number, flavors: Flavors): string {
    return `${flavors.filter((flavor) => flavor.brand === resultByTab[i].name).length} вкусов`;
  }

  private openBrandCard(brandName: string) {
    location.hash = `/mixer/brands/${brandName.toLowerCase()}`;
  }

  private searchBy(inputValue: string, category: SearchCategory) {
    const property = this[`${category}`];
    if (!property) return;
    const searchedValue = inputValue.trim().toLowerCase().slice(0, SHORTENED_WORD_LENGTH);
    if (searchedValue.length === 0) return;
    const filteredArr = this.getFilteredPropertyArr(property, searchedValue, category);
    return filteredArr.length > 0 ? filteredArr : null;
  }

  private getFilteredPropertyArr(property: Flavors | Mixes | Brands, searchedValue: string, category: string) {
    return property.filter((elem: Brand | Flavor | Mix) => {
      return (
        elem.name.toLowerCase().includes(searchedValue) ||
        (category === 'flavors' &&
          ((elem as Flavor).description.includes(searchedValue) ||
            (elem as Flavor).flavor.join('').includes(searchedValue))) ||
        (category === 'mixes' && (elem as Mix).description.includes(searchedValue))
      );
    });
  }

  private searchByAll(inputValue: string): FoundResults {
    this.apiUsers.searchAccessor(inputValue);
    const foundFlavors = <Flavors | null>this.searchBy(inputValue, 'flavors');
    const foundMixes = <Mixes | null>this.searchBy(inputValue, 'mixes');
    const foundBrands = <Brands | null>this.searchBy(inputValue, 'brands');
    if (foundFlavors instanceof Array)
      foundFlavors.sort((a, b) => sortFoundFlavorResultsByTheStringStart(a, b, inputValue));
    if (foundMixes instanceof Array) foundMixes.sort((a, b) => sortFoundMixResultsByTheStringStart(a, b, inputValue));
    if (foundBrands instanceof Array)
      foundBrands.sort((a, b) => sortFoundBrandResultsByTheStringStart(a, b, inputValue));
    return {
      foundFlavors,
      foundMixes,
      foundBrands,
    };
  }

  private async checkDataBase() {
    if (this.brands && this.flavors && this.mixes) return;
    await this.updateData();
  }

  private async updateData() {
    this.brands = getDataFromLS('brands') ?? (await this.api.getAllBrands());
    this.flavors = getDataFromLS('flavors') ?? (await this.api.getAllFlavors());
    const userMixes = getDataFromLS('userMixes') ?? (await this.apiMix.getAllUsersMix());
    const defaultMixes = getDataFromLS('mixes') ?? (await this.api.getAllMixes());
    this.mixes = [...defaultMixes, ...userMixes];
    await this.getSuggestions();
    await this.checkPref();
  }

  private async checkPref() {
    const profile = getDataFromLS('blenderProfile');
    if (profile == null) return;
    const pref = await this.apiUsers.flavorPreferenceAccessor(profile._id);
    if (isPreferencesType(pref)) this.preferences = pref;
  }

  private async handleEnterKeyOnSearchInput(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    document.querySelector('.search-aside')?.classList.add('search-aside--hidden');
    document.querySelector('.suggestions-container')?.remove();
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    await this.checkDataBase();
    this.foundResults = this.searchByAll(input.value);
    this.showSearchResults();
  }

  private autoCompleteMatch(inputValue: string) {
    const reg = new RegExp(inputValue.toLowerCase());
    return this.suggestions.filter((term) => (term.match(reg) ? term : false));
  }

  private handleClickOnSuggestionsItem(suggestion: HTMLLIElement) {
    const searchInput = document.querySelector('.search__input');
    if (!(searchInput instanceof HTMLInputElement)) return;
    searchInput.value = suggestion.textContent ?? '';
    searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    document.querySelector('.suggestions-container')?.classList.add('suggestions-container--hidden');
  }

  private createSuggestionsList(predictedQueries: string[]) {
    const suggestionsList = createHTMLElement('suggestions-list');
    const suggestionsListLenght = predictedQueries.length > 10 ? 10 : predictedQueries.length;
    for (let i = 0; i < suggestionsListLenght; i++)
      suggestionsList.append(this.createSuggestionsListItem(predictedQueries, i));
    return suggestionsList;
  }

  private createSuggestionsListItem(predictedQueries: string[], i: number) {
    const suggestionsListItem = <HTMLLIElement>createHTMLElement('suggestions-list__item', 'li', predictedQueries[i]);
    suggestionsListItem.onclick = () => this.handleClickOnSuggestionsItem(suggestionsListItem);
    return suggestionsListItem;
  }

  private handleAnyKeyExceptEnterOnSearchInput(input: HTMLInputElement) {
    document.querySelector('.search-aside')?.classList.add('search-aside--hidden');
    document.querySelector('.tabs')?.remove();
    document.querySelector('.search-list')?.remove();
    if (this.suggestions.length === 0) return;
    const suggestionsContainer =
      document.querySelector('.suggestions-container') ??
      document.querySelector('.search__container')?.appendChild(createHTMLElement('suggestions-container'));
    if (!suggestionsContainer) return;
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.classList.remove('suggestions-container--hidden');
    suggestionsContainer.append(this.createSuggestionsList(this.autoCompleteMatch(input.value)));
  }

  private async handleInputSumbit(event: KeyboardEvent, input: HTMLInputElement) {
    document.querySelector('.search-error-message')?.remove();
    if (input.value === '') {
      document.querySelector('.tabs')?.remove();
      document.querySelector('.search-aside')?.classList.remove('search-aside--hidden');
      document.querySelector('.suggestions-container')?.remove();
      document.querySelector('.search-list')?.remove();
    }
    if (event.key === 'Enter') return this.handleEnterKeyOnSearchInput(event);
    if (event.key !== 'Enter' && input.value !== '') return this.handleAnyKeyExceptEnterOnSearchInput(input);
  }

  private showSearchResults() {
    const container = document.querySelector('.search__container');
    if (!container) return;
    const tabs = document.querySelector('.tabs') ?? container.appendChild(this.createSearchTabs());
    this.makePreviouslyCheckedTabActive(tabs);
  }

  private makePreviouslyCheckedTabActive(tabs: Element) {
    tabs.childNodes.forEach((tab) => {
      if (!(tab instanceof HTMLInputElement)) return;
      tab.checked === true ? tab.click() : false;
    });
  }

  private async getSuggestions() {
    if (!this.brands || !this.flavors || !this.mixes) return;
    const brandsNamesArr = this.brands.map((brand) => brand.name.toLowerCase());
    const flavorsNamesArr = this.flavors.map((flavor) => flavor.name.toLowerCase());
    const flavorsFlavorsArr = this.flavors.map((flavor) => flavor.flavor).flat(2);
    const mixesNamesArr = this.mixes.map((mix) => mix.name.toLowerCase());
    this.suggestions = Array.from(
      new Set([...brandsNamesArr, ...flavorsNamesArr, ...flavorsFlavorsArr, ...mixesNamesArr])
    );
  }
}

export default SearchPage;
