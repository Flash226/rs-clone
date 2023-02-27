import { handleChangeOfFlavorsInMixer } from '../../utils/changeFlavorNum';
import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../types/types';
const logo = require('../../assets/images/logo.svg');

class Header implements InterfaceContainerElement {
  private handlerHash = (): void => {
    const hash = window.location.hash.slice(1);
    const menuItems = document.querySelectorAll('.header__menu a');
    if (hash.includes('search')) {
      menuItems[1].classList.add('active');
      menuItems[0].classList.remove('active');
      menuItems[2].classList.remove('active');
      menuItems[3].classList.remove('active');
    } else if (hash.includes('mixer')) {
      menuItems[2].classList.add('active');
      menuItems[0].classList.remove('active');
      menuItems[1].classList.remove('active');
      menuItems[3].classList.remove('active');
    } else if (hash.includes('account')) {
      menuItems[3].classList.add('active');
      menuItems[0].classList.remove('active');
      menuItems[1].classList.remove('active');
      menuItems[2].classList.remove('active');
    } else if (hash.length === 1) {
      menuItems[0].classList.add('active');
      menuItems[1].classList.remove('active');
      menuItems[2].classList.remove('active');
      menuItems[3].classList.remove('active');
    }
    handleChangeOfFlavorsInMixer();
  };

  private handler = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (target.textContent === 'Главная') {
      window.location.hash = `#/`;
    } else if (target.textContent === 'Поиск') {
      window.location.hash = `#/search`;
    } else if (target.textContent === 'Миксер') {
      window.location.hash = `#/mixer`;
    } else if (target.textContent === 'Профиль') {
      window.location.hash = `#/account`;
    }
  };

  draw(): HTMLElement {
    const header = createHTMLElement('header', 'header');

    header.innerHTML = `
      <div class="header__container container">
        <div class="header__logo">
          <a href="/#"><img src="${logo}" alt="logo" height="60"></a>
        </div>
        <nav class="header__menu">
          <ul>
            <li><a>Главная</a></li>
            <li><a>Поиск</a></li>
            <li><a>Миксер</a></li>
            <li><a>Профиль</a></li>
          </ul>
        </nav>
      </div>
      `;
    header.addEventListener('click', this.handler);
    window.addEventListener('hashchange', this.handlerHash);
    window.addEventListener('load', this.handlerHash);
    return header;
  }
}

export default Header;
