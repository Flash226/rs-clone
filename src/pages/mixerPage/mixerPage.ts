import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import { handleChangeOfFlavorsInMixer } from '../../utils/changeFlavorNum';
import headerChange from '../../components/headerChange/headerChange';
import blender from '../../assets/images/blender.svg';
class MixerPage implements InterfaceContainerElement {
  draw(): HTMLElement {
    const main = createHTMLElement('main', 'main');

    main.innerHTML = `
    <div class="mixer__container container">

    <div class="mixer">
      <div class="mixer__inner">
        <img src="${blender}" height="180">
        <p>Выберите свои предпочтения, а мы подберем подходящий для Вас микс вкусов!</p>
        <button class="button button-1"><a href="#/mixer/brands">Перейти в каталог</a></button>
        <button class="button button-1"><a href="#/mixer/preferences/flavors">Выбрать по предпочтениям</a></button>
        <button class="button button-1"><a href="#/mix/random">Случайный микс</a></button>
        </div>
    </div>

    </div>
    `;
    const button = document.createElement('button');
    button.id = 'mixer-now';
    button.className = 'main__mixer';
    button.onclick = () => {
      location.hash = '/mixer/mixer-now';
    };
    main.appendChild(button);

    return main;
  }
}

export default MixerPage;
