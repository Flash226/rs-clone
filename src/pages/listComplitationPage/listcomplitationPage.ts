import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import { Mix, Mixes, Flavors, Brands } from '../../components/types/types';
import Api from '../../components/api/api';
import Preloader from '../../components/preloader/preloader';
import ApiMix from '../../components/api_mix/api_mix';
import backArrow from '../../assets/images/back-arrow-white.png';
import ratingStarIconSrc from '../../assets/images/star-empty.svg';
import favoriteIconSrc from '../../assets/images/favorite.svg';
import favoriteActiveIconSrc from '../../assets/images/favorite_active.svg';
import getMainHeader from '../../components/getMainHeader/getMainHeader';
import headerChange from '../../components/headerChange/headerChange';

class ListComplitationPage implements InterfaceContainerElement {
  private api: Api;
  private mix: Mix;
  private preloader: Preloader;
  // private apiMix: ApiMix;
  private brandId: number;
  private mixes: Mixes;
  private flavors: Flavors;
  private brands: Brands;

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
    this.draw();
    this.preloader.removePreloader();
  }

  draw(): HTMLElement {
    if (this.brands === undefined) {
      const main = createHTMLElement('main', 'main');
      return main;
    } else {
      const main = document.querySelector('.main') as HTMLElement;
      const maincontainer = createHTMLElement(['main__container', 'container']);
      maincontainer.innerHTML = `<div class="complitation-list complitation-list-brands">
      <div class="complitation-list__items"></div></div>`;
      main.append(maincontainer);
      const complitationlistitems = document.querySelector('.complitation-list__items');
      this.brands.forEach((e) => {
        const brandArr = this.flavors.filter((f) => f.brand == e.name).map((f) => f.id);
        const brandComplitationArr = this.mixes.filter((e) =>
          Object.values(e.compositionById).every((v) => brandArr.includes(v))
        );
        if (brandComplitationArr.length > 0) {
          const brand = e.name.replace(/[\s-]/g, '').toLocaleLowerCase();
          const item = createHTMLElement([`complitation-list__item`, `item-${brand}`]);
          item.innerHTML = `<div class="complitation-name">${e.name}</div>
        <div class="complitation-desc">Миксы на все случаи жизни от ${brand}</div>`;
          item.onclick = () => {
            window.location.hash = `/complitation/${e.id}`;
            getMainHeader();
          };
          complitationlistitems?.append(item);
        }
      });
      window.onpopstate = getMainHeader;
      setTimeout(() => {
        headerChange('Подборки: бренды');
      }, 0);
      return main;
    }
  }
}

export default ListComplitationPage;
