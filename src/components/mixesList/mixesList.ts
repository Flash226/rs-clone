import { createHTMLElement } from '../../utils/createHTMLElement';
import { Mixes } from '../types/types';
import Api from '../api/api';
import ratingStarIconSrc from '../../assets/images/star-empty.svg';

const ERROR_MESSAGE = 'Произошла ошибка. Ничего не найдено. Попробуйте снова...';

export class MixesList {
  private mixes?: Mixes;
  private api: Api;
  constructor(mixes?: Mixes) {
    this.api = new Api();
    if (mixes) this.mixes = mixes;
  }
  public create(isSearchList?: boolean): HTMLElement {
    const list = createHTMLElement('mixes-list', 'ul');
    if (isSearchList) list.classList.add('search-list');
    if (!this.mixes) {
      list.classList.add('mixes-list--error-mesage');
      list.textContent = ERROR_MESSAGE;
      return list;
    }
    for (let i = 0; i < this.mixes.length; i++) {
      const listItem = this.createListItem(i);
      if (listItem) list.appendChild(listItem);
    }
    return list;
  }

  private createListItem(i: number) {
    if (!this.mixes) return;
    const listItem = createHTMLElement('mixes-list__card', 'li');
    const mixImg = <HTMLImageElement>createHTMLElement('mixes-list__card-img', 'img');
    mixImg.src = this.api.getImage(this.mixes[i].image);
    listItem.appendChild(mixImg);
    const container = createHTMLElement('mixes-list__card-container');
    const mixTitle = createHTMLElement('mixes-list__title', 'span');
    mixTitle.textContent = this.mixes[i].name;
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
    ratingNum.innerText = '-.-';
    ratingContainer.appendChild(ratingNum);
    listItemFooter.appendChild(ratingContainer);
    container.appendChild(listItemFooter);
    listItem.appendChild(container);
    listItem.onclick = () => this.openMixCard();
    return listItem;
  }

  private openMixCard() {
    /*  */
  }
}
