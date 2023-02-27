import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import errorImgSrc from '../../assets/images/error-404.png';

class ErrorPage implements InterfaceContainerElement {
  draw(): HTMLElement {
    const main = createHTMLElement('main');
    const errorContainer = createHTMLElement('error');
    const errorMessage = createHTMLElement('error__message', 'p', 'Oops! Page not found...');
    errorContainer.appendChild(errorMessage);
    const errorImg = <HTMLImageElement>createHTMLElement('error__image', 'img');
    errorImg.src = errorImgSrc;
    errorContainer.appendChild(errorImg);
    main.appendChild(errorContainer);
    return main;
  }
}

export default ErrorPage;
