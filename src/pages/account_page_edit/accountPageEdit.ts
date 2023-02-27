import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import ApiUsers from '../../components/api_users/apiUsers';
const favorite = require('../../assets/images/favorite.png');
const profile = require('../../assets/images/profile.svg');
const myMix = require('../../assets/images/my_mixes.svg');
import ProfileUser from '../../components/profile_user/profile_user';
import { server } from '../../components/server/server';
import { Profile } from '../../components/types/types';

class AccountPageEdit implements InterfaceContainerElement {
  private apiUsers;
  private ProfileUser;
  private server;
  constructor() {
    this.apiUsers = new ApiUsers();
    this.ProfileUser = new ProfileUser();
    this.server = server;
  }

  private handler = (e: Event): void => {
    const target = e.target as HTMLElement;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = (fileInput.files as FileList)[0];
    if (target.closest('.button-save')) {
      const nameInput = document.getElementById('name') as HTMLInputElement;
      let name = '';
      if (nameInput.value) {
        name = nameInput.value;
      }

      const nameInstagramInput = document.getElementById('instagram-name') as HTMLInputElement;
      let nameInstagram = '';
      if (nameInstagramInput.value) {
        nameInstagram = nameInstagramInput.value[0] === '@' ? nameInstagramInput.value : `@${nameInstagramInput.value}`;
      }

      const updateProfile = (data: false | Profile) => {
        if (data !== false) {
          data.name = name;
          data.instagramAccount = nameInstagram;
          this.ProfileUser.setProfile(data);
        }
      };
      if (file) {
        this.apiUsers.uploadImage(file).then((data) => {
          const fileName = data.filename;
          this.ProfileUser.getProfile().then((data) => {
            if (data) {
              data.avatar = fileName;
              updateProfile(data);
            }
          });
        });
      } else {
        this.ProfileUser.getProfile().then((data) => {
          if (data) {
            updateProfile(data);
          }
        });
      }
      setTimeout(() => {
        window.location.hash = `/account`;
      }, 100);
    } else if (target.classList.contains('text-change-button')) {
      fileInput.click();
    }
    if (file && target.id === 'fileInput') {
      const file = (fileInput.files as FileList)[0];
      if (file.size > 1024 * 1024 * 6) {
        alert('Файл превышает лимит (6 MB)');
        e.preventDefault();
        return;
      }
      const url = URL.createObjectURL(file);
      const img = document.querySelector('.profile') as HTMLImageElement;
      img.src = `${url}`;
    }
  };

  draw(): HTMLElement {
    const main = createHTMLElement('main', 'main');
    this.ProfileUser.getProfile().then((data) => {
      if (data !== false) {
        const photo = data.avatar ? `${this.server}/${data.avatar}` : profile;
        main.innerHTML = `
      <div class="main__container container">
        <div class="section-edit">
          <div class="change-photo">
            <div class="img-profile cell-img">
              <img class="profile" src="${photo}">
            </div>
            <input type="file" id="fileInput" style="display: none;" accept=".jpg,.jpeg,.png">
            <div class="text-change-button">Изменить фото</div>
          </div>
          <div class="inputs">
            <label for="name">Твоё имя</label>
            <input type="text" name="name" id="name" value="${data.name}">
            <label for="instagram-name">Твой ник в Instagram</label>
            <input type="text" name="instagram-name" id="instagram-name" value="${data.instagramAccount}">
          </div>
          <div class="button button-save"><span>Сохранить</span></div>
        </div>
      </div>
      `;
      }
    });
    main.addEventListener('click', this.handler);
    main.addEventListener('change', this.handler);
    return main;
  }
}

export default AccountPageEdit;
