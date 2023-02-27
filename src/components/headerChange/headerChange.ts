import backArrow from '../../assets/images/back-arrow-white.png';
import { createHTMLElement } from '../../utils/createHTMLElement';
import getMainHeader from '../../components/getMainHeader/getMainHeader';

export default function headerChange(title: string, className = `secondary`): void {
  const header = document.querySelector('.header');
  const headercontainer = document.querySelector('.header__container');
  if (header && headercontainer) {
    header.className = `header`;
    headercontainer.classList.add(className);
    headercontainer.innerHTML = '';
    const complitationbuttons = createHTMLElement('secondary__buttons');
    const imgarrow = new Image();
    imgarrow.src = backArrow;
    imgarrow.alt = 'back-arrow';
    imgarrow.className = 'arrow-back';
    imgarrow.onclick = () => {
      if (window.location.hash == `#/mixer`) {
        window.location.hash = `#/`;
      } else {
        window.history.back();
      }
      getMainHeader();
    };
    complitationbuttons.append(imgarrow);
    headercontainer.append(complitationbuttons);
    const complitationtitle = createHTMLElement('secondary__title');
    complitationtitle.innerHTML = title;
    headercontainer.append(complitationtitle);
  }
}
