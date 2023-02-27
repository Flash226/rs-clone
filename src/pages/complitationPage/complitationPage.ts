import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import { Mix, Mixes, Flavors, Brands, Rates } from '../../components/types/types';
import Api from '../../components/api/api';
import Preloader from '../../components/preloader/preloader';
import backArrow from '../../assets/images/back-arrow-white.png';
import ratingStarIconSrc from '../../assets/images/star-empty.svg';
import favoriteIconSrc from '../../assets/images/favorite.svg';
import favoriteActiveIconSrc from '../../assets/images/favorite_active.svg';
import getMainHeader from '../../components/getMainHeader/getMainHeader';
import getRatingStar from '../../components/getRatingStar/getRatingStar';

class ComplitationPage implements InterfaceContainerElement {
  private api: Api;
  private mix: Mix;
  private preloader: Preloader;
  private mixes: Mixes;
  private flavors: Flavors;
  private brands: Brands;
  private rates: Rates;
  private brandId: number;
  private brandName: string;
  constructor() {
    this.brandId = Number(
      window.location.hash.split('complitation/')[window.location.hash.split('complitation/').length - 1]
    );
    this.api = new Api();
    this.getData();
  }
  private async getData() {
    this.preloader = new Preloader();
    this.preloader.draw();
    this.brands = await this.api.getAllBrands();
    this.flavors = await this.api.getAllFlavors();
    this.mixes = await this.api.getAllMixes();
    this.brandName = this.brands.filter((e) => e.id === this.brandId)[0].name;
    this.rates = await this.api.getAllRate();
    this.draw();
    this.preloader.removePreloader();
  }

  changeHeader(): void {
    const header = document.querySelector('.header');
    const headercontainer = document.querySelector('.header__container');
    if (header && headercontainer) {
      header.className = `header header-${this.brandName.replace(/[\s-]/g, '').toLocaleLowerCase()}`;
      headercontainer.classList.add('container-complitation');
      headercontainer.innerHTML = '';
      const complitationbuttons = createHTMLElement('complitation__buttons');
      const imgarrow = new Image();
      imgarrow.src = backArrow;
      imgarrow.alt = 'back-arrow';
      imgarrow.className = 'arrow-back';
      imgarrow.onclick = () => {
        window.history.back();
        getMainHeader();
      };
      complitationbuttons.append(imgarrow);
      headercontainer.append(complitationbuttons);
      const complitationtitle = createHTMLElement('complitation__title');
      complitationtitle.innerHTML = this.brandName;
      headercontainer.append(complitationtitle);
    }
  }

  draw(): HTMLElement {
    if (this.mixes === undefined) {
      const main = createHTMLElement('main', 'main');
      return main;
    } else {
      const main = document.querySelector('.main') as HTMLElement;
      const maincontainer = createHTMLElement(['main__container', 'container']);
      maincontainer.innerHTML = `<div class="mixes-list mixes-list-complitation"></div>`;
      main.append(maincontainer);
      const brandArr = this.flavors.filter((e) => e.brand == this.brandName).map((e) => e.id);
      const brandComplitationArr = this.mixes.filter((e) =>
        Object.values(e.compositionById).every((v) => brandArr.includes(v))
      );
      const mixeslist = document.querySelector('.mixes-list-complitation');

      brandComplitationArr.forEach((e) => {
        const card = createHTMLElement('mixes-list__card');
        const rate = this.rates.filter((r) => r.id == e.id)[0]?.rate || '-';
        card.innerHTML = `<img class="mixes-list__card-img"
      src="${this.api.getImage(e.image)}">
    <div class="mixes-list__card-container"><span class="mixes-list__title">${e.name}</span>
      <div class="mixes-list__card-footer"><button class="mixes-list__button button-1">Попробовать</button>
        <div class="mixes-list__rating-container"><img class="mixes-list__favorite-icon"
            src="${favoriteIconSrc}"><img class="mixes-list__rating-icon"
            src="${getRatingStar(e.id)}"><span class="mixes-list__rating-num">${rate}</span></div>
      </div>
    </div>`;
        card.onclick = () => {
          window.location.hash = `/mix/${e.id}`;
          getMainHeader();
        };
        mixeslist?.append(card);
      });

      window.onpopstate = getMainHeader;
      setTimeout(() => {
        this.changeHeader();
      }, 0);
      return main;
    }
  }
}

export default ComplitationPage;
