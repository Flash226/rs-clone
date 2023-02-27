import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';
import ApiUsers from '../../components/api_users/apiUsers';
import ModalWindowRegistration from '../../components/modal_window_registration/modal_window_registration';
import ApiMix from '../../components/api_mix/api_mix';
import ProfileUser from '../../components/profile_user/profile_user';
import getMainHeader from '../../components/getMainHeader/getMainHeader';

class AccountPage implements InterfaceContainerElement {
  private apiUsers;
  private modalWindowRegistration;
  private apiMix;
  private profileUser;
  constructor() {
    this.apiUsers = new ApiUsers();
    this.apiMix = new ApiMix();
    this.profileUser = new ProfileUser();
    this.modalWindowRegistration = new ModalWindowRegistration();
  }

  private handler = (e: Event): void => {
    const target = e.target as HTMLElement;
    const message = document.querySelector('.message_container') as HTMLElement;
    const buttons = document.querySelectorAll('.button span') as NodeList;
    const title = document.querySelector('h3') as HTMLElement;
    const emailInput = document.querySelector('.email') as HTMLInputElement;
    const passwordInput = document.querySelector('.password') as HTMLInputElement;
    if (target.textContent === 'Зарегистрироваться' && target.classList.contains('span-button')) {
      buttons[0].textContent = 'Регистрация';
      buttons[1].textContent = 'Войти';
      title.textContent = 'Регистрация';
      emailInput.value = '';
      passwordInput.value = '';
    } else if (target.textContent === 'Войти' && target.classList.contains('span-button')) {
      buttons[0].textContent = 'Вход';
      buttons[1].textContent = 'Зарегистрироваться';
      title.textContent = 'Вход';
      emailInput.value = '';
      passwordInput.value = '';
    }

    if (target.classList.contains('submit-btn')) {
      const formElement = document.getElementById('form') as HTMLFormElement;
      if (formElement.checkValidity()) {
        e.preventDefault();
        const formData = new FormData(formElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        if (target.textContent === 'Регистрация') {
          this.apiUsers.newUser(email, password).then((data) => {
            if (data.message === 'A user with the same name already exists') {
              message.append(this.modalWindowRegistration.draw('Пользователь с таким именем уже существует!', 'red'));
            } else if (data.message === 'Registration error') {
              message.append(
                this.modalWindowRegistration.draw('Ошибка регистрации, обратитесь к администратору', 'red')
              );
            } else if (data.message === 'User successfully registered') {
              message.append(
                this.modalWindowRegistration.draw(
                  'Регистрация завершена, войдите в свой аккаунт с помощью email и пароля указаных при регистрации.'
                )
              );
            }
          });
        } else {
          this.apiUsers.getAuth(email, password).then((data) => {
            if (data.token) {
              window.localStorage.setItem('blender', JSON.stringify(data));
              window.location.hash = `/account/`;
            }
            if (data.message) {
              if (data.message.includes('User')) {
                message.append(this.modalWindowRegistration.draw('Пользователь с таким именем не найден.', 'red'));
              }
              if (data.message.includes('Password')) {
                message.append(this.modalWindowRegistration.draw('Пароль введен не верно.', 'red'));
              }
              console.log(data.message);
            }
          });
        }
      }
    }
  };

  draw(): HTMLElement {
    const main = createHTMLElement('main', 'main');

    main.innerHTML = `
    <div class="main__container container">
    <form id="form">
      <div class="account">
        <div class="account__inner">
          <h3>Вход</h3>
            <input type="email" name="email" placeholder="Электронная почта" class="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" title="Enter valid email address" required>
            <input type="password" name="password" placeholder="Пароль" class="password" minlength="5" required>
            <button class="button submit-btn" type="submit"><span class="submit-btn">Войти</span></button>
            </form>
            <div class="button button-1"><span class="span-button">Зарегистрироваться</span></div>
        </div>
        <div class="message_container"><div>
      </div>
    </div>
    `;
    main.addEventListener('click', this.handler);
    setTimeout(() => {
      getMainHeader();
    }, 0);
    return main;
  }
}

export default AccountPage;
