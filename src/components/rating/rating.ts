import { createHTMLElement } from '../../utils/createHTMLElement';
import starempty from '../../assets/images/star-empty.svg';
import staremptyblack from '../../assets/images/star-empty-black.svg';
import stargold from '../../assets/images/star-gold.svg';
import starhalf from '../../assets/images/star-half.svg';
import ApiMix from '../api_mix/api_mix';
import ProfileUser from '../profile_user/profile_user';
import { mixRate } from '../../components/types/types';
import { getTextCountMix } from '../getTextCountMix/getTextCountMix';

class rating {
  private mixId: number;
  private vote: number;
  private Apimix: ApiMix;
  private profileUser: ProfileUser;
  private profileId: string | false;
  private getRateResult: mixRate;
  private rate: string;
  private starstop: string;
  constructor(mixId: number, vote: number, getRateResult: mixRate) {
    this.mixId = mixId;
    this.Apimix = new ApiMix();
    this.vote = vote;
    this.profileUser = new ProfileUser();
    this.profileId = this.profileUser.getUserId();
    this.getRateResult = getRateResult;
  }
  topdraw(): void {
    this.starstop = '';
    let half = false;
    if (this.getRateResult.rate % 1 == 0) {
      for (let i = 0; i < 5; i++) {
        if (this.getRateResult.rate > i) this.starstop += `<img src="${stargold}" class="mix-card__star" alt="star">`;
        else this.starstop += `<img src="${starempty}" class="mix-card__star" alt="star">`;
      }
    } else {
      for (let i = 0; i < 5; i++) {
        if (Math.floor(this.getRateResult.rate) > i)
          this.starstop += `<img src="${stargold}" class="mix-card__star" alt="star">`;
        else {
          if (!half) {
            this.starstop += `<img src="${starhalf}" class="mix-card__star" alt="star">`;
            half = true;
          } else this.starstop += `<img src="${starempty}" class="mix-card__star" alt="star">`;
        }
      }
    }
    this.rate = `${this.getRateResult.rate} ・ ${this.getRateResult.vote} ${getTextCountMix(this.getRateResult.vote, [
      'оценка',
      'оценки',
      'оценок',
    ])}`;
  }
  draw(): void {
    this.starstop = `<img src="${starempty}" class="mix-card__star" alt="star">`.repeat(5);
    this.rate = 'Нет оценок';
    if (this.getRateResult.rate > 0) {
      this.topdraw();
    }
    const ratingtop = createHTMLElement('mix-card__rating-row');
    ratingtop.innerHTML = `<div class="mix-card__stars">${this.starstop}</div><div class="mix-card__rating">${this.rate}</div>`;
    document.querySelector('.mix-card__more-info')?.prepend(ratingtop);
    let rated = '';
    let title = `Поставь свою оценку`;
    let starbottom = staremptyblack;
    if (this.vote > 0) {
      rated = 'rated';
      starbottom = stargold;
      title = `Твоё мнение учтено!`;
    }
    const ratingbottom = createHTMLElement('mix-rating');
    ratingbottom.innerHTML = `
    <div class="mix-rating__inner">
      <div class="mix-rating__stars ${rated}">
        <img src="${starbottom}" class="rating__star" alt="star" width="28" height="28">
      </div>
      <div class="mix-rating__title">${title}</div>
    </div>`;
    ratingbottom.onclick = this.open;
    document.querySelector('.main__container')?.append(ratingbottom);
  }
  private open = (e: Event) => {
    const mixratingstars = document.querySelector('.mix-rating__stars') as HTMLElement;
    if (
      ((<HTMLElement>e.target).classList.contains('mix-rating__stars') ||
        (<HTMLElement>e.target).classList.contains('rating__star')) &&
      !mixratingstars?.classList.contains('active')
    ) {
      mixratingstars?.classList.add('active');
      let stars = ``;
      for (let i = 0; i < 5; i++) {
        if (this.vote > 0) {
          if (this.vote > i) stars += `<img src="${stargold}" class="rating__star" alt="star" width="28" height="28">`;
          else stars += `<img src="${starempty}" class="rating__star" alt="star" width="28" height="28">`;
        } else stars += `<img src="${staremptyblack}" class="rating__star" alt="star" width="28" height="28">`;
      }
      setTimeout(() => {
        mixratingstars.innerHTML = stars;
      }, 150);
    } else if (
      (<HTMLElement>e.target).classList.contains('rating__star') &&
      mixratingstars?.classList.contains('active')
    ) {
      const index = Array.from(document.querySelectorAll('.rating__star')).indexOf(<HTMLElement>e.target);
      this.vote = index + 1;
      mixratingstars.classList.remove('active');
      mixratingstars.innerHTML = `<img src="${stargold}" class="rating__star" alt="star" width="28" height="28">`;
      mixratingstars.classList.add('rated');
      const mixratingtitle = document.querySelector('.mix-rating__title');
      if (mixratingtitle !== null) mixratingtitle.innerHTML = `Твоё мнение учтено!`;

      (async () => {
        if (typeof this.profileId === 'string') {
          this.Apimix.setRate(this.profileId, this.mixId, this.vote)
            .then((result) => (this.getRateResult = result))
            .then(() => {
              this.topdraw();
              const mixcardstars = document.querySelector('.mix-card__stars');
              const mixcardrating = document.querySelector('.mix-card__rating');
              if (mixcardstars !== null && mixcardrating !== null) {
                mixcardstars.innerHTML = this.starstop;
                mixcardrating.innerHTML = this.rate;
              }
            });
        }
      })();
    } else if (
      (<HTMLElement>e.target).classList.contains('mix-rating__stars') &&
      mixratingstars?.classList.contains('active') &&
      !mixratingstars?.classList.contains('rated')
    ) {
      mixratingstars.classList.remove('active');
      mixratingstars.innerHTML = `<img src="${staremptyblack}" class="rating__star" alt="star" width="28" height="28">`;
    } else if (
      (<HTMLElement>e.target).classList.contains('mix-rating__stars') &&
      mixratingstars?.classList.contains('active') &&
      mixratingstars?.classList.contains('rated')
    ) {
      mixratingstars.classList.remove('active');
      mixratingstars.innerHTML = `<img src="${stargold}" class="rating__star" alt="star" width="28" height="28">`;
    }
  };
}
export default rating;
