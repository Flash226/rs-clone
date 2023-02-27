import { createHTMLElement } from '../../utils/createHTMLElement';
import preloaderimg from '../../assets/images/preloader.gif';

class Preloader {
  element: HTMLElement;
  draw(): void {
    const preloader = createHTMLElement('preloader');
    preloader.innerHTML = `<img src="${preloaderimg}" class="preloader__img">
        <p class="preloader__text">Загрузка</p>`;
    document.body.append(preloader);
    // this.element = preloader;
  }
  removePreloader(): void {
    document.querySelector('.preloader')?.remove();
    // this.element.remove();
  }
}
export default Preloader;
