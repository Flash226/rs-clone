import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement, Mixes } from '../../components/types/types';
import info from '../../assets/images/info.svg';
import { initSlider, onResizeSlider, onSliderChange } from '../../components/slider/slider';
import Chart from 'chart.js/auto';
import { ChartItem } from '../../../node_modules/chartjs-plugin-outerlabels';
import '../../../node_modules/chartjs-plugin-outerlabels';
import { Mix, PromiseFlavors, Flavor, mixRate } from '../../components/types/types';
import Api from '../../components/api/api';
import { createPopup, openFlavorPopup } from '../../components/popup/popup';
import Preloader from '../../components/preloader/preloader';
import favoriteIconSrc from '../../assets/images/favorite.svg';
import favoriteActiveIconSrc from '../../assets/images/favorite_active.svg';
import ProfileUser from '../../components/profile_user/profile_user';
import ApiMix from '../../components/api_mix/api_mix';
import CheckAuth from '../../components/checkAuth/checkAuth';
import ModalWindowRegistration from '../../components/modal_window_registration/modal_window_registration';
import rating from '../../components/rating/rating';
import { getImgSrc } from '../../utils/getImgUrl';
import { getRandomMixNumber } from '../../utils/getRandomMixNum';
import headerChange from '../../components/headerChange/headerChange';
import getMainHeader from '../../components/getMainHeader/getMainHeader';
import backArrow from '../../assets/images/back-arrow-white.png';

class MixPage implements InterfaceContainerElement {
  private api: Api;
  private mix: Mix;
  private flavorsIds: number[];
  private flavorsPercentages: number[];
  private flavorsOfMix: PromiseFlavors;
  private flavorsNames: string[] = [];
  private flavorsBrands: string[] = [];
  private flavorsStrength: number[] = [];
  private preloader: Preloader;
  private profileUser: ProfileUser;
  private apiMix: ApiMix;
  private checkAuth: CheckAuth;
  private activeUser: boolean;
  private modalWindow: ModalWindowRegistration;
  private rating: rating;
  private mixId: number;
  private vote: number;
  private getRateResult: mixRate;
  private chart: Chart<'doughnut', number[], string>;
  constructor() {
    this.mixId = Number(window.location.hash.split('mix/')[window.location.hash.split('mix/').length - 1]);
    this.api = new Api();
    this.profileUser = new ProfileUser();
    this.apiMix = new ApiMix();
    this.checkAuth = new CheckAuth();
    this.modalWindow = new ModalWindowRegistration();
    this.getData();
  }
  private async getData() {
    this.preloader = new Preloader();
    this.preloader.draw();
    if (isNaN(this.mixId)) this.mixId = await getRandomMixNumber();
    this.vote = this.apiMix.getVote(this.mixId);
    this.getRateResult = await this.apiMix.getRate(this.mixId);
    let allMixes: Mixes;
    const mixesInLS = localStorage.getItem('mixes');
    // if (mixesInLS) {
    //   allMixes = JSON.parse(mixesInLS);
    //   const matchedMix = allMixes.find((mix) => mix.id === this.mixId);
    //   if (matchedMix) this.mix = matchedMix;
    // } else {
    this.mix = await this.api.getMix(this.mixId);
    // }
    this.flavorsIds = Object.values(this.mix.compositionById);
    this.flavorsPercentages = Object.values(this.mix.compositionByPercentage);
    this.flavorsOfMix = await Promise.allSettled(this.flavorsIds.map((id) => this.api.getFlavor(id))).then(
      (results) => results
    );
    this.activeUser = await this.checkAuth.checkUserAuth();
    this.flavorsIds.forEach((_, index) => {
      this.flavorsNames.push(String(this.flavorsOfMix[index].value?.name));
      this.flavorsBrands.push(String(this.flavorsOfMix[index].value?.brand));
      if (this.flavorsOfMix[index].value?.strength === 'крепкий') this.flavorsStrength.push(3);
      else if (this.flavorsOfMix[index].value?.strength === 'средний') this.flavorsStrength.push(2);
      if (this.flavorsOfMix[index].value?.strength === 'легкий') this.flavorsStrength.push(1);
    });

    this.draw();
    this.preloader.removePreloader();
  }

  private changeRange = (e: Event) => {
    if ((<HTMLInputElement>e.target).classList.contains('tick-slider-input')) {
      let strength = 0;
      const all = document.querySelectorAll('.tick-slider-input').length;
      const index = Array.from(document.querySelectorAll('.tick-slider-input')).indexOf(e.target as HTMLElement);
      let startPosition = 100;
      //countMin get how many elements is 0
      let countMin = 0;
      //countMax get how many elements is 100
      let countMax = 0;
      document.querySelectorAll('.tick-slider-input').forEach((elem, i) => {
        if (index != i) startPosition -= Number((<HTMLInputElement>elem).value);
        if (Number((<HTMLInputElement>elem).value) == 0) countMin += 1;
        if (Number((<HTMLInputElement>elem).value) == 100) countMax += 1;
      });
      const change = Number((<HTMLInputElement>e.target).value) - startPosition;
      document.querySelectorAll('.tick-slider-input').forEach((elem, i) => {
        if (index != i && Number((<HTMLInputElement>elem).value) != 0 && change >= 0) {
          (<HTMLInputElement>elem).value = String(
            Number((<HTMLInputElement>elem).value) - Math.ceil(change / (all - 1 - countMin))
          );
        } else if (index != i && Number((<HTMLInputElement>elem).value) != 100 && change <= 0) {
          (<HTMLInputElement>elem).value = String(
            Number((<HTMLInputElement>elem).value) - Math.ceil(change / (all - 1 - countMax))
          );
        }
        onSliderChange(<HTMLInputElement>elem);
        strength += Number((<HTMLInputElement>elem).value) * this.flavorsStrength[i];
      });
      this.mixStrength(strength);
      this.updateflavorsPercentages();
      this.chart.data.datasets[0].data = this.flavorsPercentages;
      this.chart.update();
    }
  };
  private changeSize = (): void => {
    const myChart = document.querySelector('#myChart');
    if (window.innerWidth < 640 && myChart?.getAttribute('name') == 'desk') {
      myChart?.setAttribute('name', 'mob');
      this.chart.destroy();
      this.doughnutChart(-50, (n: ChartItem) => `${n.value + '%'}`);
      const chartplugins = this.chart.options.plugins;
      if (chartplugins && chartplugins.legend && chartplugins.outerLabels) {
        chartplugins.legend.display = true;
      }
      Chart.defaults.font.size = 14;
      this.chart.update();
    } else if (window.innerWidth >= 640 && myChart?.getAttribute('name') == 'mob') {
      myChart?.setAttribute('name', 'desk');
      this.chart.destroy();
      this.doughnutChart();
    }
  };
  private updateflavorsPercentages = (): void => {
    const inputs = document.querySelectorAll('.tick-slider-input') as NodeListOf<HTMLInputElement>;
    this.flavorsPercentages = Array.from(inputs).map((e) => Number(e.value));
  };
  private updateSliderValuePosition = (): void => {
    const tab1 = document.querySelector('#tab-mix-btn-1') as HTMLInputElement;
    if (
      (document.querySelector('#component1LabelMin') as HTMLElement).classList.contains('hidden') &&
      (document.querySelector('#component1LabelMax') as HTMLElement).classList.contains('hidden')
    )
      Array.from(document.querySelectorAll('.tick-slider-input') as NodeListOf<HTMLInputElement>).forEach((e) =>
        onSliderChange(e)
      );
  };
  private switcher = (): void => {
    initSlider();
    if ((<HTMLInputElement>document.querySelector('#switch')).checked)
      (<HTMLElement>document.querySelector('.mix-card__buttons-row')).style.display = 'flex';
    else (<HTMLElement>document.querySelector('.mix-card__buttons-row')).style.display = 'none';
  };
  private setGram = (e: Event): void => {
    if ((<HTMLButtonElement>e.target).classList.contains('button-2')) {
      Array.from((<HTMLElement>document.querySelector('.mix-card__buttons-row'))?.children).forEach((elem) => {
        if (elem == e.target) {
          if (!elem.classList.contains('active')) elem.classList.add('active');
        } else elem.classList.remove('active');
      });
      initSlider();
    }
  };
  private popupOpenClose = (e: Event): void => {
    if ((<HTMLElement>e.target).classList.contains('more')) {
      const index = Array.from(document.querySelectorAll('.more')).indexOf(e.target as HTMLElement);
      openFlavorPopup(this.flavorsOfMix[index].value as Flavor);
    }
    const target = e.target as HTMLElement;
    if (target.classList.contains('favorite-ico')) {
      if (this.activeUser) {
        const favoriteIco = document.querySelector('.favorite-ico') as HTMLImageElement;
        if (favoriteIco.classList.contains('favorite-active')) {
          favoriteIco.src = favoriteIconSrc;
          favoriteIco.classList.remove('favorite-active');
        } else {
          favoriteIco.src = favoriteActiveIconSrc;
          favoriteIco.classList.add('favorite-active');
        }
        const userId = this.profileUser.getUserId();
        if (typeof userId === 'string' && userId.length > 12) {
          this.apiMix.setFavorite(userId, this.mix.id);
        }
      } else {
        const containerMessage = document.querySelector('.message_container') as HTMLElement;
        containerMessage.append(
          this.modalWindow.draw(
            `Чтобы сохранить микс, надо авторизоваться. <br><br>
            Это займет мало времени, зато откроет новый мир возможностей.`
          )
        );
      }
    }
  };
  private doughnutChart = (myOffset = 15, callback = (n: any) => `${n.value + '%'} ${n.label}`): void => {
    const ctx = document.getElementById('myChart');
    const colorsArray = ['#06a396', '#fa320a', '#f6bc25', '#202d91', '#f96509', '#987e41', '#914198'];
    const colors: string[] = [];
    for (let i = 0; i < this.flavorsIds.length; i++) {
      if (i < colorsArray.length) colors.push(colorsArray[i]);
      else colors.push('#' + ((Math.random() * 0x1000000) | 0x1000000).toString(16).slice(1));
    }
    this.chart = new Chart(<HTMLCanvasElement>ctx, {
      type: 'doughnut',
      data: {
        // outerLabels: this.flavorsNames,
        labels: this.flavorsNames,
        datasets: [
          {
            // label: 'My First Dataset',
            data: this.flavorsPercentages,
            backgroundColor: colors,
            // hoverOffset: 4
          },
        ],
      },
      options: {
        cutout: `40%`,
        plugins: {
          outerLabels: {
            // formatter: (val) => val.label,
            fontNormalSize: 18,
            fontNormalColor: '#FFFFFF',
            fontBoldSize: 18,
            fontBoldColor: '#FFFFFF',
            twoLines: true,
            offset: myOffset,
            // formatter:
            formatter: callback,
            // debug: true,
          },
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
            labels: {
              color: '#FFFFFF',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: false,

        layout: {
          padding: 10,
        },
        events: [],
      },
    });
  };

  private mixStrength = (strength: number): void => {
    const mixStrength = <HTMLElement>document.querySelector('.mix-card__strength');
    if (strength / 100 > 2.5) mixStrength.innerHTML = 'Крепкий';
    else if (strength / 100 > 1.5) mixStrength.innerHTML = 'Средний';
    else {
      mixStrength.innerHTML = 'Легкий';
    }
  };

  draw(): HTMLElement {
    if (this.mix === undefined) {
      const main = createHTMLElement('main', 'main');
      return main;
    } else {
      const main = document.querySelector('.main') as HTMLElement;
      let components = '';
      let strength = 0;
      for (let i = 0; i < this.flavorsIds.length; i++) {
        strength += this.flavorsPercentages[i] * this.flavorsStrength[i];
        components += `<div class="component">
      <div class="component__container">
        <img src="${this.api.getImage(String(this.flavorsOfMix[i].value?.image))}" width="96" height="96" alt="${
          this.flavorsNames[i]
        }">
        <div class="component__info">
          <div class="component__title">${this.flavorsNames[i]}</div>
          <div class="component__must"><button class="button button-2">${this.flavorsBrands[i]}</button></div>
        </div>
        <div class="component__more"><img src="${info}" class="more" height="32" width="32"></div>
      </div>
      <div class="component__quantity">
          
      <div class="tick-slider">
      <div class="tick-slider-value-container">
          <div id="component${i + 1}LabelMin" class="tick-slider-label">0</div>
          <div id="component${i + 1}LabelMax" class="tick-slider-label">100</div>
          <div id="component${i + 1}Value" class="tick-slider-value"></div>
      </div>
      <div class="tick-slider-background"></div>
      <div id="component${i + 1}Progress" class="tick-slider-progress"></div>
      <div id="component${i + 1}Ticks" class="tick-slider-tick-container"></div>
      <input
          id="component${i + 1}Slider"
          class="tick-slider-input"
          type="range"
          min="0"
          max="100"
          step="1"
          value="${this.flavorsPercentages[i]}"
          data-tick-id="component${i + 1}Ticks"
          data-value-id="component${i + 1}Value"
          data-progress-id="component${i + 1}Progress"
          data-handle-size="18"
          data-min-label-id="component${i + 1}LabelMin"
          data-max-label-id="component${i + 1}LabelMax">
  </div>
  </div> 
  </div>`;
      }

      main.innerHTML = `
    <div class="message_container">
    <div class="main__container container">

      <div class="mix-card">
        
        <div class="mix-card__img">
          <img src="${getImgSrc(
            this.mix.image,
            this.api.getImage(this.mix.image)
          )}" alt="name" width="220" height="220">
        </div>
        <div class="mix-card__container">
        <div class="mix-card__title-container">
          <h1 class="mix-card__title">${this.mix.name}</h1>
          <div class="mix-card__favorite"><img class="favorite-ico" src="${favoriteIconSrc}"></div>
          </div>
          <div class="mix-card__desc">${this.mix.description}</div>
          <div class="mix-card__more-info">
            
            
            <div class="mix-card__strength-row">
              <div><span>Крепость</span></div>
              <div class="mix-card__strength"></div>
            </div>
            <div class="mix-card__calc-row">
              <div><span>Расчитать в граммах</span></div>
              <div class="calc"><input type="checkbox" id="switch"/><label for="switch">Toggle</label></div>
            </div>
            <div class="mix-card__buttons-row">
              <button class="button button-2 active">20 г.</button>
              <button class="button button-2">25 г.</button>
              <button class="button button-2">30 г.</button>
            </div>
          </div>
        </div>
        <div class="mix-card__back">
          <img src="${backArrow}" alt="back-arrow" class="arrow-back"/>
        </div>
      </div>

      <div id="tabs-mix" class="tabs">
        <input type="radio" name="tab-btn" id="tab-mix-btn-1" value="" checked>
        <label for="tab-mix-btn-1">Компонеты</label>
        <input type="radio" name="tab-btn" id="tab-mix-btn-2" value="">
        <label for="tab-mix-btn-2">Диаграмма</label>
        <div id="composition">${components}
        </div>
        <div id="diagram">
          <div class="compotion-chart widen hidden">
            <canvas id="myChart" name="desk"></canvas>
          </div>
        </div>
      </div>
      
    </div>
    `;

      main.addEventListener('click', this.popupOpenClose);
      window.addEventListener('resize', () => {
        onResizeSlider();
        this.changeSize();
      });
      setTimeout(() => {
        this.mixStrength(strength);
        createPopup(main);
        this.rating = new rating(this.mixId, this.vote, this.getRateResult);
        this.rating.draw();
        initSlider();
        this.doughnutChart();
        // this.changeSize();
        document.querySelector('#switch')?.addEventListener('click', this.switcher);
        document.querySelector('.mix-card__buttons-row')?.addEventListener('click', this.setGram);
        document.querySelector('#composition')?.addEventListener('input', this.changeRange);
        document.querySelector('#tab-mix-btn-1')?.addEventListener('click', this.updateSliderValuePosition);
        document.querySelector('#tab-mix-btn-2')?.addEventListener(
          'click',
          () => {
            const chartcontainer = document.querySelector('.compotion-chart') as HTMLElement;
            setTimeout(() => {
              chartcontainer.classList.remove('widen');
              this.changeSize();
              chartcontainer.classList.remove('hidden');
            }, 0);
          },
          { once: true }
        );
        headerChange(this.mix.name, `secondary-mix`);
        document.querySelector('.mix-card__back')?.addEventListener('click', () => {
          window.history.back();
          location.hash = '/';
          getMainHeader();
        });
        document.querySelector('.header')?.classList.add('header-mix');
        const userId = this.profileUser.getUserId();
        if (typeof userId === 'string' && userId.length > 12) {
          this.apiMix.getFavorite(userId).then((data) => {
            if (data.indexOf(this.mix.id) !== -1) {
              const favoriteIco = document.querySelector('.favorite-ico') as HTMLImageElement;
              favoriteIco.src = favoriteActiveIconSrc;
              favoriteIco.classList.add('favorite-active');
            }
          });
        }
      }, 0);
      return main;
    }
  }
}

export default MixPage;
