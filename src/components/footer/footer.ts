import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../types/types';
const logogithub = require('../../assets/images/github.svg');
const logors = require('../../assets/images/rs-school.svg');
import mixerButtonImgSrc from '../../assets/images/blender.svg';
import { createFooterNav } from '../footerNav/footerNav';

class Footer implements InterfaceContainerElement {
  draw(): HTMLElement {
    const footer = createHTMLElement('footer', 'footer');
    const container = createHTMLElement(['footer__container', 'container']);
    footer.append(container);

    container.innerHTML = `
      <div class="footer__content">
        <div class="footer__github">
        <img src="${logogithub}" alt="Github" height="32"> <a href="https://github.com/Flash226/" target="_blank">flash226</a> | <a href="https://github.com/fkodirov/" target="_blank">fkodirov</a> | <a href="https://github.com/vberezhnykh/" target="_blank">vberezhnykh</a></div>
        <p class="footer__text">2023</p>
        <div class="footer__rs"><a href="https://rs.school/js/" target="_blank"><img src="${logors}" alt="RS School" height="32"></a></div>
      </div>
      `;
    container.append(createFooterNav());
    return footer;
  }
}

export default Footer;
