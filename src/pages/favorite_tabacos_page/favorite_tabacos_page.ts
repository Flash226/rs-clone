import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import backArrowImgSrc from '../../assets/images/back-arrow-white.png';
import Api from '../../components/api/api';
import Preloader from '../../components/preloader/preloader';
import ApiMix from '../../components/api_mix/api_mix';
import ProfileUser from '../../components/profile_user/profile_user';
import { Flavors } from '../../components/types/types';
import mixerButtonImgSrc from '../../assets/images/blender.svg';
import { getFlavorsInMixer } from '../../utils/getFlavorsInMixer';
import { server } from '../../components/server/server';
import { Flavor } from '../../components/types/types';
import infoImgSrc from '../../assets/images/info.svg';
import addNewImgSrc from '../../assets/images/add-new.png';
import { createPopup, openFlavorPopup } from '../../components/popup/popup';
import { changeFlavorNumInBrandPageHeader } from '../../utils/changeFlavorNum';

const ERROR_MESSAGE = 'Для начала добавьте хоть один табак в избранное...';

class FavoriteTobaccosPage implements InterfaceContainerElement {
  private flavors: Flavors;
  api: Api;
  apiMix: ApiMix;
  preloader: Preloader;
  private profileUser;
  private brandList: [string, number][];
  constructor() {
    this.api = new Api();
    this.preloader = new Preloader();
    this.apiMix = new ApiMix();
    this.profileUser = new ProfileUser();
  }

  private handler = (e: Event): void => {
    const target = e.target as HTMLElement;
    let activeBrand: string | null = '';
    if (target.classList.contains('brand-button') && target.closest('.brand-list')) {
      activeBrand = target.textContent;
      if (activeBrand) {
        activeBrand = activeBrand.split('(')[0]?.trim();
      }
      if (activeBrand !== null) {
        this.getData(activeBrand);
        document.querySelector('.brand-list')?.querySelector('.active-brand')?.classList.remove('active-brand');
        target.classList.add('active-brand');
      }
    }
  };

  public async getData(brand?: string): Promise<void> {
    this.preloader.draw();
    let flavorsId: number[] = [];
    const flavors: Flavor[] = [];
    const userId = this.profileUser.getUserId();
    if (userId) {
      flavorsId = await this.apiMix.getFavoriteFlavors(userId);
      if (flavorsId.length !== 0) {
        for (let i = 0; i < flavorsId.length; i += 1) {
          const id = flavorsId[i];
          flavors.push(await this.api.getFlavor(id));
        }
      }
    }
    let flavorsSorted = flavors;
    const brands: string[] = [];
    for (let i = 0; i < flavorsSorted.length; i += 1) {
      brands.push(flavorsSorted[i].brand);
    }
    const elementCounts: { [key: string]: number } = {};
    for (const element of brands) {
      if (element in elementCounts) {
        elementCounts[element] += 1;
      } else {
        elementCounts[element] = 1;
      }
    }
    const brandsList: [string, number][] = Object.entries(elementCounts).map(([element, count]) => [element, count]);
    this.brandList = brandsList;
    if (brand && brand !== 'All brands') {
      flavorsSorted = flavors.filter((el) => el.brand === brand);
    } else if (!brand) {
      this.createBrandList(this.brandList);
    }
    this.createFlavorsList(flavorsSorted);
    this.preloader.removePreloader();
  }

  draw(): HTMLElement {
    document.querySelector('.result-container')?.remove();
    const brandPage = createHTMLElement('brand-page favorite-flavors');
    brandPage.appendChild(this.createHeader());
    const brandList = createHTMLElement('brand-list', 'div');
    brandPage.appendChild(brandList);
    const flavorsList = createHTMLElement('flavor-list', 'ul');
    brandPage.appendChild(flavorsList);
    createPopup(brandPage);
    brandPage.addEventListener('click', this.handler);
    this.getData();
    return brandPage;
  }

  private createHeader(): HTMLElement {
    const header = createHTMLElement('brand-page-header', 'div');
    header.appendChild(this.createHeaderBackBtn());
    header.appendChild(createHTMLElement('brand-page__title', 'h2', 'Мои любимые табаки'));
    header.appendChild(this.createHeaderMixerButton());
    return header;
  }

  private createHeaderBackBtn(): HTMLElement {
    const backBtn = createHTMLElement('brand__back-button', 'button');
    backBtn.style.backgroundImage = `url(${backArrowImgSrc})`;
    backBtn.onclick = () => history.back();
    return backBtn;
  }

  private createHeaderMixerButton(): HTMLElement {
    const mixerBtn = createHTMLElement('catalog__mixer-image', 'button');
    mixerBtn.style.backgroundImage = `url(${mixerButtonImgSrc})`;
    const flavorsInMixerNum = getFlavorsInMixer().length;
    if (flavorsInMixerNum !== 0) {
      mixerBtn.append(createHTMLElement('catalog__mixer-number', 'div', flavorsInMixerNum.toString()));
    }
    mixerBtn.onclick = () => (location.hash = '/mixer/mixer-now');
    return mixerBtn;
  }

  private createBrandList(brands?: [string, number][]): HTMLElement {
    if (brands) {
      const brandList = document.querySelector('.brand-list') as HTMLElement;
      let allFlavors = 0;
      for (let i = brands.length; i > 0; i -= 1) {
        const brandButton = createHTMLElement('fav-flavor__container__brand item-brands', 'div');
        brandButton.innerHTML = `<span class="brand-button">${brands[i - 1][0]} (${brands[i - 1][1]})</span>`;
        brandList.prepend(brandButton);
        allFlavors += brands[i - 1][1];
      }
      const brandButton = createHTMLElement('fav-flavor__container__brand item-brands', 'div');
      brandButton.innerHTML = `<span class="brand-button active-brand">All brands (${allFlavors})</span>`;
      brandList.prepend(brandButton);
      return brandList;
    }
    const brandList = createHTMLElement('brand-list', 'div');
    return brandList;
  }

  private async createFlavorsList(flavors?: Flavor[]): Promise<HTMLElement> {
    const flavorsList = document.querySelector('.flavor-list') as HTMLElement;
    flavorsList.innerHTML = '';
    if (flavors) {
      if (flavors.length === 0) return this.showErrorMessage(flavorsList);
      const flavorsToIterate = flavors ?? this.flavors;
      for (let i = 0; i < flavorsToIterate.length; i++) {
        flavorsList.appendChild(this.createFlavorListItem(i, flavorsToIterate));
      }
    }
    return flavorsList;
  }

  private showErrorMessage(flavorsList: HTMLElement): HTMLElement {
    flavorsList.append(ERROR_MESSAGE);
    flavorsList.classList.add('catalog-list--error');
    return flavorsList;
  }

  private createFlavorListItem(i: number, flavors: Flavors): HTMLElement {
    const flavorListItem = createHTMLElement('fav-flavor-list__item', 'li');
    const logoBrand = document.createElement('img');
    logoBrand.src = `${server}/${flavors[i].image.replace(/^\.\//, '')}`;
    logoBrand.classList.add('fav-flavor__logo');
    flavorListItem.appendChild(logoBrand);
    const textContainer = createHTMLElement('fav-flavor__container', 'div');
    textContainer.appendChild(createHTMLElement('fav-flavor__container__name', 'div', flavors[i].name));
    const brandButton = createHTMLElement('fav-flavor__container__brand', 'div');
    brandButton.innerHTML = `<span class="brand-button">${flavors[i].brand}</span>`;
    textContainer.appendChild(brandButton);
    flavorListItem.appendChild(textContainer);
    flavorListItem.appendChild(this.createImage('flavor__image--info', infoImgSrc, flavors[i]));
    flavorListItem.appendChild(this.createImage('flavor__image--add-new', addNewImgSrc, flavors[i]));
    return flavorListItem;
  }

  private createImage(className: string, src: string, flavor?: Flavor): HTMLImageElement {
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

  private handleClickOnAddButton(image: HTMLImageElement, flavor: Flavor): void {
    image.classList.toggle('flavor__image--added');
    const flavorsInMixer = getFlavorsInMixer();
    const indexOfFlavorInMixer = flavorsInMixer.findIndex((flavorInMixer) => flavorInMixer.id === flavor.id);
    if (image.classList.contains('flavor__image--added') && indexOfFlavorInMixer === -1) flavorsInMixer.push(flavor);
    else flavorsInMixer.splice(indexOfFlavorInMixer, 1);
    localStorage.setItem('flavorsInMixer', JSON.stringify(flavorsInMixer));
    changeFlavorNumInBrandPageHeader();
  }
}

export default FavoriteTobaccosPage;
