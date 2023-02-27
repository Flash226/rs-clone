import { createHTMLElement } from '../../utils/createHTMLElement';
import cancel from '../../assets/images/cancel.svg';
import { Flavor, Flavors, Mixes } from '../../components/types/types';
import Api from '../../components/api/api';
import { getFlavorsInMixer } from '../../utils/getFlavorsInMixer';
import { handleChangeOfFlavorsInMixer } from '../../utils/changeFlavorNum';
import Preloader from '../preloader/preloader';
import { MixerNowResult } from '../mixerResult/mixer-result';
import favoriteIconSrc from '../../assets/images/favorite.svg';
import favoriteActiveIconSrc from '../../assets/images/favorite_active.svg';
import CheckAuth from '../checkAuth/checkAuth';
import ProfileUser from '../profile_user/profile_user';
import ApiMix from '../api_mix/api_mix';
import ModalWindowRegistration from '../modal_window_registration/modal_window_registration';
import { getImgSrc } from '../../utils/getImgUrl';

const ADD_BUTTON_TEXT = 'Добавить в миксер';
const REMOVE_BUTTON_TEXT = 'Удалить из миксера';

export function createPopup(elem: HTMLElement): void {
  if (!document.querySelector('.popup-flavor')) {
    const flavor = createHTMLElement('popup-flavor');
    flavor.innerHTML = `<div class="popup-flavor__inner">
        <img src="" class="popup-flavor__img">
        <img src="${cancel}" class="popup-flavor__img-cancel">
        <div class="popup-flavor__info">
          <div class="popup-flavor__title"></div>
          <div class="popup-flavor__desc"></div>
          <div class="popup-flavor__must"><button class="button button-2"></button></div>
        </div>
        <div class="popup-flavor__favorite-icon"></div>
        <div class="popup-flavor__buttons">
        <button class="button button-3 popup-flavor__add-button">${ADD_BUTTON_TEXT}</button>
        <button class="button button-3 popup-flavor__pick-up-button">Подобрать миксы со вкусом</button>
        </div>
      </div>
      <div class="message_container">`;
    elem.appendChild(flavor);
    flavor.onclick = (e) => {
      if ((<HTMLElement>e.target).classList.contains('popup-flavor__img-cancel')) {
        (<HTMLElement>document.querySelector('.popup-flavor')).style.display = 'none';
      } else if ((<HTMLElement>e.target).closest('.popup-flavor__favorite-icon')) {
        clickAddToFavoriteButton(<HTMLElement>document.querySelector('.popup-flavor__favorite-icon'));
      }
    };
  }
}

export function openFlavorPopup(flavorObj: Flavor, addButtonOnBrandPageOrMixerPage?: Element): void {
  const api = new Api();
  (<HTMLElement>document.querySelector('.popup-flavor__img')).setAttribute(
    'src',
    getImgSrc(flavorObj.image, api.getImage(flavorObj.image))
  );
  (<HTMLElement>document.querySelector('.popup-flavor__title')).innerHTML = `${flavorObj.name}`;
  (<HTMLElement>document.querySelector('.popup-flavor__desc')).innerHTML = `${flavorObj.description}`;
  (<HTMLElement>document.querySelector('.popup-flavor__must')).children[0].innerHTML = `${flavorObj.brand}`;
  (<HTMLElement>document.querySelector('.popup-flavor')).style.display = 'block';
  const favoriteElement = <HTMLElement>document.querySelector('.popup-flavor__favorite-icon');
  favoriteElement.id = `${flavorObj.id}`;
  favoriteElement.innerHTML = `<img src="${favoriteIconSrc}" class="favorite-ico"><span>Сохранить в "Мои табаки"</span>`;
  const apiMix = new ApiMix();
  const profileUser = new ProfileUser();
  const userId = profileUser.getUserId();
  if (typeof userId === 'string' && userId.length > 12) {
    apiMix.getFavoriteFlavors(userId).then((data) => {
      if (data.indexOf(flavorObj.id) !== -1) {
        favoriteElement.innerHTML = `<img src="${favoriteActiveIconSrc}" class="favorite-ico favorite-active"><span>Удалить из "Мои табаки"</span>`;
      }
    });
  }
  const addButton = document.querySelector('.popup-flavor__add-button');
  if (!(addButton instanceof HTMLElement)) return;
  markButtonIfFlavorAddedToMixer(flavorObj, addButton);
  addButton.onclick = () => handleClickOnAddButton(addButton, flavorObj, addButtonOnBrandPageOrMixerPage);
  const pickUpButton = document.querySelector('.popup-flavor__pick-up-button');
  if (!(pickUpButton instanceof HTMLButtonElement)) return;
  pickUpButton.onclick = () => handleClickOnPickUpBtn(pickUpButton, flavorObj, api);
}

function markButtonIfFlavorAddedToMixer(flavorObj: Flavor, addButton: Element) {
  const index = getFlavorsInMixer().findIndex((flavor) => flavor.id === flavorObj.id);
  if (index === -1) {
    addButton.classList.remove('popup-flavor__added-button');
    addButton.textContent = ADD_BUTTON_TEXT;
  } else {
    addButton.classList.add('popup-flavor__added-button');
    addButton.textContent = REMOVE_BUTTON_TEXT;
  }
}

function handleClickOnAddButton(addButton: HTMLElement, flavor: Flavor, addBtnOnBrandPageOrMixerPage?: Element) {
  if (!(addButton instanceof HTMLButtonElement)) return;
  addButton.classList.toggle('popup-flavor__added-button');
  const flavorsInMixer = getFlavorsInMixer();
  const indexOfFlavorInMixer = flavorsInMixer.findIndex((flavorInMixer) => flavorInMixer.id === flavor.id);
  if (addButton.classList.contains('popup-flavor__added-button') && indexOfFlavorInMixer === -1) {
    addFlavorToMixer(addButton, flavorsInMixer, flavor, addBtnOnBrandPageOrMixerPage);
  } else {
    removeFlavorFromMixer(addButton, flavorsInMixer, indexOfFlavorInMixer, addBtnOnBrandPageOrMixerPage);
    if (addBtnOnBrandPageOrMixerPage?.classList.contains('mixer-now__info-btn'))
      removeFlavorFromMixerPage(addBtnOnBrandPageOrMixerPage);
  }
  localStorage.setItem('flavorsInMixer', JSON.stringify(flavorsInMixer));
  handleChangeOfFlavorsInMixer();
}

function removeFlavorFromMixer(
  addButton: HTMLButtonElement,
  flavorsInMixer: Flavors,
  indexOfFlavorInMixer: number,
  addButtonOnBrandPage: Element | undefined
) {
  addButton.textContent = ADD_BUTTON_TEXT;
  flavorsInMixer.splice(indexOfFlavorInMixer, 1);
  if (addButtonOnBrandPage) addButtonOnBrandPage.classList.remove('flavor__image--added');
}

function addFlavorToMixer(
  addButton: HTMLButtonElement,
  flavorsInMixer: Flavors,
  flavor: Flavor,
  addButtonOnBrandPage: Element | undefined
) {
  addButton.textContent = REMOVE_BUTTON_TEXT;
  flavorsInMixer.push(flavor);
  if (addButtonOnBrandPage) addButtonOnBrandPage.classList.add('flavor__image--added');
}

function removeFlavorFromMixerPage(btn: Element) {
  const removeButton = btn.nextElementSibling;
  if (!removeButton) return;
  (removeButton as HTMLElement).click();
}

async function handleClickOnPickUpBtn(btn: HTMLButtonElement, flavor: Flavor, api: Api) {
  const preloaderInstance = new Preloader();
  preloaderInstance.draw();
  let allMixes: Mixes = [];
  const mixesInLS = localStorage.getItem('mixes');
  if (mixesInLS) allMixes = JSON.parse(mixesInLS);
  else allMixes = await api.getAllMixes();
  const matchingMixes = allMixes.filter((mix) => {
    const mixComposition = mix.compositionById;
    if (!(mixComposition instanceof Object)) return;
    return Object.values(mixComposition).includes(flavor.id);
  });
  document.body.appendChild(new MixerNowResult(matchingMixes).create());
  const closePopUpBtn = document.querySelector('.popup-flavor__img-cancel');
  if (closePopUpBtn) (closePopUpBtn as HTMLElement).click();
  preloaderInstance.removePreloader();
}

async function clickAddToFavoriteButton(fav: HTMLElement) {
  const checkAuth = new CheckAuth();
  const profileUser = new ProfileUser();
  const apiMix = new ApiMix();
  const modalWindow = new ModalWindowRegistration();
  const isActiveUser = await checkAuth.checkUserAuth();
  if (await isActiveUser) {
    const favoriteIco = fav.querySelector('.favorite-ico') as HTMLImageElement;
    const favoriteText = fav.querySelector('span') as HTMLElement;
    if (favoriteIco.classList.contains('favorite-active')) {
      favoriteIco.src = favoriteIconSrc;
      favoriteIco.classList.remove('favorite-active');
      favoriteText.innerHTML = `Сохранить в "Мои табаки"`;
    } else {
      favoriteIco.src = favoriteActiveIconSrc;
      favoriteIco.classList.add('favorite-active');
      favoriteText.innerHTML = `Удалить из "Мои табаки"`;
    }
    const userId = profileUser.getUserId();
    if (typeof userId === 'string' && userId.length > 12) {
      apiMix.setFavoriteFlavor(userId, Number(fav.id));
    }
  } else {
    const containerMessage = document.querySelector('.message_container') as HTMLElement;
    containerMessage.append(
      modalWindow.draw(
        `Чтобы сохранить вкус, надо авторизоваться. <br><br>
        Это займет мало времени, зато откроет новый мир возможностей.`
      )
    );
  }
}
