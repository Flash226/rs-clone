import Header from '../../components/header/header';
export default function getMainHeader() {
  const header = new Header();
  document.querySelector('.header')?.remove();
  document.body.prepend(header.draw());
}
