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
import headerChange from '../../components/headerChange/headerChange';

class PopularMixes implements InterfaceContainerElement {
  private api: Api;
  private mix: Mix;
  private preloader: Preloader;
  private mixes: Mixes;
  private rates: Rates;
  private popularMixes: Mixes;
  constructor() {
    this.api = new Api();
    this.getData();
  }
  private async getData() {
    this.preloader = new Preloader();
    this.preloader.draw();
    this.popularMixes = await this.api.getTop10();
    this.rates = await this.api.getAllRate();
    this.draw();
    this.preloader.removePreloader();
  }

  draw(): HTMLElement {
    if (this.popularMixes === undefined) {
      const main = createHTMLElement('main', 'main');
      return main;
    } else {
      const main = document.querySelector('.main') as HTMLElement;
      const maincontainer = createHTMLElement(['main__container', 'container']);
      maincontainer.innerHTML = `<div class="mixes-list mixes-list-complitation"></div>`;
      main.append(maincontainer);
      const mixeslist = document.querySelector('.mixes-list-complitation');

      this.popularMixes.forEach((e) => {
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
        };
        mixeslist?.append(card);
      });

      window.onpopstate = getMainHeader;
      setTimeout(() => {
        headerChange(`Популярные миксы`);
      }, 0);
      return main;
    }
  }
}

export default PopularMixes;
