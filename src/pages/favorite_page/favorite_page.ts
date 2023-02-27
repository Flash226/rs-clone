import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement, Mixes } from '../../components/types/types';
import backArrowImgSrc from '../../assets/images/back-arrow.png';
import { MixesList } from '../../components/mixesList/mixesList';
import Api from '../../components/api/api';
import Preloader from '../../components/preloader/preloader';
import ApiMix from '../../components/api_mix/api_mix';
import ProfileUser from '../../components/profile_user/profile_user';

class FavoritePage implements InterfaceContainerElement {
  mixes?: Mixes;
  api: Api;
  preloader: Preloader;
  private apiMix;
  private profileUser;
  constructor() {
    this.api = new Api();
    this.preloader = new Preloader();
    this.apiMix = new ApiMix();
    this.profileUser = new ProfileUser();
  }
  draw() {
    const main = createHTMLElement('main', 'main');
    const container = createHTMLElement(['main__container', 'container']);
    main.appendChild(container);
    let UserMixesContainer;
    this.createUserMixesPopup().then((data) => {
      UserMixesContainer = data;
      container.appendChild(UserMixesContainer);
    });
    return main;
  }

  private async createUserMixesPopup() {
    const UserMixesContainer = createHTMLElement('user-mixes-container');
    UserMixesContainer.appendChild(this.createUserMixesPopupHeader());
    if (!this.mixes) {
      this.preloader.draw();
      const userId = this.profileUser.getUserId();
      if (typeof userId === 'string') {
        const favoriteMixId = await this.apiMix.getFavorite(userId);
        const favoriteMix = [];
        for (let i = 0; i < favoriteMixId.length; i += 1) {
          favoriteMix.push(await this.api.getMix(favoriteMixId[i]));
        }
        this.mixes = favoriteMix;
      }
      this.preloader.removePreloader();
    }
    const userMixesList = new MixesList(this.mixes).create();
    UserMixesContainer.appendChild(userMixesList);
    return UserMixesContainer;
  }

  private createUserMixesPopupHeader() {
    const header = createHTMLElement('user-mixes__header');
    const navBar = createHTMLElement('user-mixes__nav', 'nav');
    const backArrowImage = new Image();
    backArrowImage.className = 'user-mixes__back-arrow';
    backArrowImage.src = backArrowImgSrc;
    backArrowImage.onclick = () => (location.hash = '/account');
    navBar.append(backArrowImage);
    header.append(navBar);
    const heading = createHTMLElement('user-mixes__heading', 'h4');
    heading.textContent = 'Любимое';
    header.append(heading);
    return header;
  }
}

export default FavoritePage;
