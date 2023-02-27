import { createHTMLElement } from '../../utils/createHTMLElement';
import home from '../../assets/images/home.svg';
import search from '../../assets/images/search.svg';
import mixer from '../../assets/images/mixer.svg';
import profile from '../../assets/images/profile.svg';
import getMainHeader from '../getMainHeader/getMainHeader';

export function createFooterNav() {
  // const footer = document.querySelector('footer');
  const footerNav = createHTMLElement('footer__nav');
  const item1 = createHTMLElement('footer__item');
  const img1 = new Image();
  img1.src = home;
  item1.onclick = () => {
    getMainHeader();
    window.location.hash = `#/`;
  };
  item1.append(img1);
  footerNav.append(item1);
  const item2 = createHTMLElement('footer__item');
  const img2 = new Image();
  img2.src = search;
  item2.onclick = () => {
    getMainHeader();
    window.location.hash = `#/search`;
  };
  item2.append(img2);
  footerNav.append(item2);
  const item3 = createHTMLElement('footer__item');
  const img3 = new Image();
  img3.src = mixer;
  item3.onclick = () => {
    getMainHeader();
    window.location.hash = `#/mixer`;
  };
  item3.append(img3);
  footerNav.append(item3);
  const item4 = createHTMLElement('footer__item');
  const img4 = new Image();
  img4.src = profile;
  item4.onclick = () => {
    getMainHeader();
    window.location.hash = `#/account`;
  };
  item4.append(img4);
  footerNav.append(item4);
  // footer?.after(footerNav);
  return footerNav;
}
