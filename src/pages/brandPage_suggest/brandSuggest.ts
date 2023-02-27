import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import backArrowImgSrc from '../../assets/images/back-arrow-white.png';
import Api from '../../components/api/api';
import defaultBrandLogoImageSrc from '../../assets/images/default_brand_logo.png';
import ApiUsers from '../../components/api_users/apiUsers';
import { Brand } from '../../components/types/types';

const PAGE_TITLE = 'Добавить бренд';
const NAME_LABEL_TEXT = 'Название бренда';
const LOGO_LABEL_TEXT = 'Логотип бренда';
const BUTTON_TEXT = 'Добавить в каталог';
const POPUP_TITLE = 'Спасибо за заявку!';
const POPUP_TEXT = 'Заявка на добавление бренда отправлена. Бренд скоро появится в каталоге.';
const POPUP_BUTTON_TEXT = 'Хорошо';
const CATALOG_PAGE_URL = `/mixer/brands`;
const INPUT_PLACEHOLDER = 'Укажите название бренда';
const MAX_FILE_SIZE = 1024 * 1024 * 6;
const EXCEEDING_MAX_FILE_SIZE_MESSAGE = 'Файл превышает лимит (6 MB)';
const INVALID_BRAND_NAME_MSG = 'Название бренда не введено или введено некорректно.';
const INVALID_LOGO_IMG_MSG = 'Логотип не загружен. Попробуйте снова.';
const MIN_BRAND_NAME_LENGTH = 2;

export class BrandSuggest implements InterfaceContainerElement {
  private brandName?: string;
  private imageName?: string;
  private api: Api;
  private apiUsers: ApiUsers;
  private currentBrands: string[];
  constructor() {
    this.api = new Api();
    this.apiUsers = new ApiUsers();
    const brandsInLS = localStorage.getItem('brands');
    if (brandsInLS) this.currentBrands = JSON.parse(brandsInLS).map((brand: Brand) => brand.name.toLowerCase());
  }
  draw() {
    const brandSuggest = createHTMLElement('brand-suggest', 'div');
    brandSuggest.appendChild(this.createHeader());
    brandSuggest.appendChild(this.createBrandAddForm());
    return brandSuggest;
  }

  private createHeader() {
    const header = createHTMLElement('brand-suggest-header', 'div');
    header.appendChild(this.createHeaderBackBtn());
    header.appendChild(createHTMLElement('brand-suggest__title', 'h2', PAGE_TITLE));
    return header;
  }

  private createHeaderBackBtn() {
    const backBtn = createHTMLElement('brand__back-button', 'button');
    backBtn.style.backgroundImage = `url(${backArrowImgSrc})`;
    backBtn.onclick = () => (location.hash = CATALOG_PAGE_URL);
    return backBtn;
  }

  private createBrandAddForm() {
    const brandAddForm = createHTMLElement('brand-form', 'form');
    const suggestBrandBtn = this.createSuggestBrandButton();
    brandAddForm.appendChild(this.createBrandNameInput(suggestBrandBtn));
    brandAddForm.appendChild(this.createBrandLogoInput());
    brandAddForm.appendChild(suggestBrandBtn);
    return brandAddForm;
  }

  private createBrandNameInput(suggestBrandButton: HTMLButtonElement) {
    const label = createHTMLElement('brand-form__label', 'label');
    label.appendChild(
      createHTMLElement(['brand-form__label-text', 'brand-form__label-text--required'], 'span', NAME_LABEL_TEXT)
    );
    const input = <HTMLInputElement>createHTMLElement('brand-form__name-input', 'input');
    input.placeholder = INPUT_PLACEHOLDER;
    input.minLength = MIN_BRAND_NAME_LENGTH;
    input.onkeyup = () => this.handleBrandNameInputKeyUp(input.value, suggestBrandButton);
    label.appendChild(input);
    return label;
  }

  private handleBrandNameInputKeyUp(inputValue: string, suggestBrandButton: HTMLButtonElement) {
    if (this.isValidBrandName(inputValue)) {
      suggestBrandButton.disabled = false;
      this.brandName = inputValue;
    } else suggestBrandButton.disabled = true;
  }

  private isValidBrandName(inputValue: string) {
    return inputValue.length > MIN_BRAND_NAME_LENGTH && !this.currentBrands.includes(inputValue.toLowerCase());
  }

  private createSuggestBrandButton() {
    const button = <HTMLButtonElement>createHTMLElement('brand-form__button', 'button', BUTTON_TEXT);
    button.disabled = true;
    button.type = 'button';
    button.onclick = (e) => this.handleClickOnSuggestBrandBtn(e);
    return button;
  }

  private handleClickOnSuggestBrandBtn(e: MouseEvent) {
    console.log(this.brandName, this.imageName);
    if (!this.brandName) {
      alert(INVALID_BRAND_NAME_MSG);
      e.preventDefault();
      return;
    } else if (!this.imageName) {
      alert(INVALID_LOGO_IMG_MSG);
      e.preventDefault();
      return;
    }
    this.api.setNewBrand(this.brandName, this.imageName);
    document.querySelector('.brand-suggest')?.before(this.createPopUp());
  }

  private createPopUp() {
    const overlay = createHTMLElement('suggest-overlay');
    const popUp = createHTMLElement('suggest-popup');
    popUp.appendChild(createHTMLElement('suggest-popup__title', 'h4', POPUP_TITLE));
    popUp.appendChild(createHTMLElement('suggest-popup__text', 'p', POPUP_TEXT));
    const button = <HTMLButtonElement>createHTMLElement('suggest-popup__button', 'button', POPUP_BUTTON_TEXT);
    button.type = 'button';
    button.onclick = () => {
      window.location.hash = CATALOG_PAGE_URL;
      document.querySelector('.suggest-overlay')?.remove();
    };
    popUp.appendChild(button);
    overlay.appendChild(popUp);
    return overlay;
  }

  private createBrandLogoInput() {
    const label = createHTMLElement('brand-form__label', 'label');
    label.appendChild(createHTMLElement('brand-form__label-text', 'span', LOGO_LABEL_TEXT));
    label.appendChild(this.createBrandLogoContainer());
    const input = <HTMLInputElement>createHTMLElement('brand-form__image-input', 'input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => this.handleBrandLogoInput(input, e);
    label.appendChild(input);
    const addButton = <HTMLButtonElement>createHTMLElement('brand-form__add-image-btn', 'button', 'Выбрать логотип');
    addButton.type = 'button';
    addButton.onclick = () => this.handleClickOnAddImgButton(input);
    label.appendChild(addButton);
    return label;
  }

  private handleClickOnAddImgButton(input: HTMLInputElement) {
    input.click();
  }

  private createBrandLogoContainer() {
    const brandLogo = new Image();
    brandLogo.className = 'brand-form__brand-logo';
    brandLogo.src = defaultBrandLogoImageSrc;
    return brandLogo;
  }

  private handleBrandLogoInput(input: HTMLInputElement, e: Event) {
    if (!input.files) return;
    const uploadedFile = input.files[0];
    if (uploadedFile.size > MAX_FILE_SIZE) return this.handleExceedingOfMaxSize(e);
    this.apiUsers.uploadImage(uploadedFile).then((res) => {
      this.imageName = res.filename;
    });
    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = () => {
      const src = reader.result;
      const brandLogoPreview = document.querySelector('.brand-form__brand-logo');
      if (typeof src !== 'string' || brandLogoPreview === null) return;
      (brandLogoPreview as HTMLImageElement).src = src;
      this.imageName = this.brandName ? this.processString(this.brandName) : uploadedFile.name;
    };
  }

  private processString(string: string): string {
    return string.toLowerCase().trim().replace(' ', '_');
  }

  private handleExceedingOfMaxSize(e: Event) {
    alert(EXCEEDING_MAX_FILE_SIZE_MESSAGE);
    e.preventDefault();
    return;
  }
}
