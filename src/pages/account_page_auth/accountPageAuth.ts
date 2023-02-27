import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement, Profile } from '../../components/types/types';
import ApiUsers from '../../components/api_users/apiUsers';
const favorite = require('../../assets/images/favorite.png');
const flavor = require('../../assets/images/my_tobacos.svg');
const profile = require('../../assets/images/profile.svg');
const myMix = require('../../assets/images/my_mixes.svg');
const instagramLogo = require('../../assets/images/instagram_logo.svg');
import ProfileUser from '../../components/profile_user/profile_user';
import { server } from '../../components/server/server';
import ApiMix from '../../components/api_mix/api_mix';
import Preloader from '../../components/preloader/preloader';
import { getTextCountMix } from '../../components/getTextCountMix/getTextCountMix';

class AccountPage implements InterfaceContainerElement {
  private apiUsers;
  private profileUser;
  private server;
  private apiMix;
  private preloader;
  private currentUser: Profile | false;
  constructor() {
    this.apiUsers = new ApiUsers();
    this.profileUser = new ProfileUser();
    this.server = server;
    this.apiMix = new ApiMix();
    this.preloader = new Preloader();
  }

  private handler = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('button-exit')) {
      window.localStorage.removeItem('blender');
      window.localStorage.removeItem('blenderProfile');
      window.location.hash = `/account/`;
    } else if (target.closest('.button-edit')) {
      window.location.hash = `/account/edit`;
    } else if (target.closest('.favorite')) {
      window.location.hash = `/account/favorite`;
    } else if (target.closest('.favorite-tobaccos')) {
      window.location.hash = `/account/favorite-tobaccos`;
    } else if (target.closest('.my-mix')) {
      window.location.hash = `/account/my-mixes`;
    }
  };

  // private async getData() {
  //   this.currentUser = await this.profileUser.getProfile();

  // }

  draw(): HTMLElement {
    // this.getData();
    // setTimeout(() => {
    //   console.log(888, this.currentUser);
    // }, 100)

    const main = createHTMLElement('main', 'main');
    this.profileUser.getProfile().then((data) => {
      if (data !== false) {
        const photo = data.avatar ? `${this.server}/${data.avatar}` : profile;
        // const getTextCountMix = (num: number, arr: string[]) => {
        //   num = Math.abs(num);
        //     if (Number.isInteger(num)) {
        //     const options = [2, 0, 1, 1, 1, 2];
        //     return arr[(num % 100 > 4 && num % 100 < 20) ? 2 : options[(num % 10 < 5) ? num % 10 : 5]];
        //   }
        // }
        main.innerHTML = `
        <div class="main__container container">
          <div class="flex-container">
            <div class="row">
              <div class="column avatar-column">
                <div class="img-profile cell-img">
                  <img class="profile" src="${photo}">
                </div>
              </div>  
              <div class="wrap-account">
              <div class="column name-column">${data.name}</div>
              <div class="instagram-column">
              <div class="img-instagram"><a href="https://www.instagram.com/${data.instagramAccount.slice(
                1
              )}" target="_blank"><img src="${instagramLogo}"></a></div>
              <div class="text-instagram"><span><a href="https://www.instagram.com/${data.instagramAccount.slice(
                1
              )}" target="_blank">${data.instagramAccount}</a></span></div>
              </div>
              <div class="column button-column">
                <div class="button-edit"><span>Настройки профиля</span></div>
              </div>
                </div>
            </div>
            <div class="row">
              <div class="column cell-img favorite">
                <img src="${favorite}">
                <p class="name">Любимые</p>
                <p class="amount">${data.favorite.length} ${getTextCountMix(data.favorite.length, [
          'микс',
          'микса',
          'миксов',
        ])}</p>
              </div>
              <div class="column cell-img my-mix">
                <img src="${myMix}">
                <p class="name">Мои миксы</p>
                <p class="amount">${data.myMix.length} ${getTextCountMix(data.myMix.length, [
          'микс',
          'микса',
          'миксов',
        ])}</p>
              </div>
              <div class="column cell-img favorite-tobaccos">
                <img src="${flavor}">
                <p class="name">Мои табаки</p>
                <p class="amount">${data.favoriteFlavors.length} ${getTextCountMix(data.favoriteFlavors.length, [
          'табак',
          'табака',
          'табаков',
        ])}</p>
              </div>
            </div>
          </div>
        <div class="button-exit">Выйти из профиля</div>
        </div>
        `;
      }
    });
    main.addEventListener('click', this.handler);
    return main;
  }
}

export default AccountPage;
