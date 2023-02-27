import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement, Mixes, Mix } from '../../components/types/types';
import backArrowImgSrc from '../../assets/images/back-arrow.png';
import Api from '../../components/api/api';
import Preloader from '../../components/preloader/preloader';
import ApiMix from '../../components/api_mix/api_mix';
import ProfileUser from '../../components/profile_user/profile_user';
import { getFlavorsInMixer } from '../../utils/getFlavorsInMixer';
import arrowDown from '../../assets/images/arrow-down.png';
import listIcon from '../../assets/images/menu-output.png';
import selectedIcon from '../../assets/images/selected_list.png';
import turkIcon from '../../assets/images/turk.png';
import killerIcon from '../../assets/images/killer.png';
import fanelIcon from '../../assets/images/fanel.png';
import siliconIcon from '../../assets/images/silicon.png';
import addImgSrc from '../../assets/images/add.svg';
import ApiUsers from '../../components/api_users/apiUsers';

const cupList = [
  {
    cup: 'Турка',
    description: 'Классическая чаша. Подходит для забивки практически любого табака.',
    image: turkIcon,
    imageMix: ['my-mix-1.jpg', 'my-mix-2.jpg'],
  },
  {
    cup: 'Убивашка',
    description:
      'Чаша с плоским дном и большими отверстиями. Позволяет курить любой табак крепче, насыщеннее. Предназначена для забивки жаростойких табаков.',
    image: killerIcon,
    imageMix: ['my-mix-3.jpg', 'my-mix-4.jpg'],
  },
  {
    cup: 'Фанел',
    description: 'Чаша с одним отверстием посередине. Предназначена для забивки табаков с большим количеством сиропа.',
    image: fanelIcon,
    imageMix: ['my-mix-5.jpg', 'my-mix-6.jpg'],
  },
  {
    cup: 'Силикон',
    description:
      'Чаша для тех, кто начинает познавать дымный мир. Крайне жароустойчива и прощает ошибки при перегреве.',
    image: siliconIcon,
    imageMix: ['my-mix-6.jpg', 'my-mix-7.jpg'],
  },
];

class CreateNewMix implements InterfaceContainerElement {
  mixes?: Mixes;
  api: Api;
  preloader: Preloader;
  newMix: Mix;
  private apiMix;
  private userId;
  private apiUsers;
  constructor() {
    this.api = new Api();
    this.preloader = new Preloader();
    this.apiMix = new ApiMix();
    this.userId = new ProfileUser().getUserId();
    this.apiUsers = new ApiUsers();
    this.handlerButtonNext = this.handlerButtonNext.bind(this);
  }
  draw() {
    const main = createHTMLElement('main', 'main');
    const container = createHTMLElement(['main__container', 'container']);
    main.appendChild(container);
    let newMixContainer;
    this.createNewMixPopup().then((data) => {
      newMixContainer = data;
      container.appendChild(newMixContainer);
    });

    // this.api.getMix(36).then((data) => {
    //   console.log(123, data)
    // })
    return main;
  }

  private async createNewMixPopup() {
    const newMixContainer = createHTMLElement('user-mixes-container') as HTMLElement;
    newMixContainer.appendChild(this.createUserMixesPopupHeader(1));
    if (getFlavorsInMixer().length < 2) {
      const newMixError = createHTMLElement(
        'new-mix__error',
        'div',
        'Для начала добавьте хотя бы 2 вкуса!'
      ) as HTMLElement;
      newMixContainer.append(newMixError);
      return newMixContainer;
    } else {
      const changedCup = createHTMLElement('new-mix__dropdown__result', 'div') as HTMLElement;
      // if (!this.mixes) {
      //   this.preloader.draw();
      //   const userId = this.profileUser.getUserId();
      //   if (typeof userId === 'string') {

      //   }
      //   this.preloader.removePreloader();
      // }
      newMixContainer.append(this.floversList(), this.createCupList(), changedCup, this.createButtonNext('Далее'));
      return newMixContainer;
    }
  }

  private floversList() {
    const containerFlovers = createHTMLElement('new-mix__container-flovers', 'ul');
    const flovers = getFlavorsInMixer();
    if (flovers.length > 1) {
      flovers.map((data) => {
        const flover = createHTMLElement('new-mix__flover', 'li');
        const floverTextContainer = createHTMLElement('new-mix__flover__container', 'div');
        const floverName = createHTMLElement('new-mix__flover__name', 'div', `${data.name}`);
        const floverBrand = createHTMLElement('new-mix__flover__brand', 'div', `${data.brand}`);
        floverTextContainer.append(floverName, floverBrand);
        const inputPercentage = document.createElement('input');
        inputPercentage.setAttribute('type', 'number');
        inputPercentage.classList.add('new-mix__flover__input');
        inputPercentage.placeholder = '0 %';
        inputPercentage.addEventListener('input', () => {
          if (inputPercentage.style.borderColor === 'red') {
            const allInput = document.querySelectorAll('.new-mix__flover__input') as NodeListOf<HTMLInputElement>;
            allInput.forEach((input) => {
              input.style.borderColor = '#898989';
            });
            const error = document.querySelector('.new-mix__warning') as HTMLElement;
            if (error) {
              error.remove();
            }
          }
        });
        flover.append(floverTextContainer, inputPercentage);
        containerFlovers.append(flover);
      });
    }
    return containerFlovers;
  }

  private createCupList() {
    const containerList = createHTMLElement('new-mix__dropdown', 'div') as HTMLElement;
    const selectedElement = createHTMLElement('new-mix__dropdown__selected', 'div') as HTMLElement;
    selectedElement.innerHTML = `<img src="${listIcon}" class="new-mix__dropdown__listIcon">
                                  <span>Не выбрано</span>
                                  <img src="${arrowDown}" class="new-mix__dropdown__arrowDown">`;
    const list = createHTMLElement('new-mix__dropdown__list', 'ul') as HTMLUListElement;
    const listElement1 = createHTMLElement('new-mix__dropdown__element', 'li', 'Не выбрано') as HTMLLIElement;
    listElement1.innerHTML = `Не выбрано <img src="${selectedIcon}" class="new-mix__dropdown__selected-img">`;
    const listElement2 = createHTMLElement('new-mix__dropdown__element', 'li', 'Турка') as HTMLLIElement;
    const listElement3 = createHTMLElement('new-mix__dropdown__element', 'li', 'Убивашка') as HTMLLIElement;
    const listElement4 = createHTMLElement('new-mix__dropdown__element', 'li', 'Фанел') as HTMLLIElement;
    const listElement5 = createHTMLElement('new-mix__dropdown__element', 'li', 'Силикон') as HTMLLIElement;
    const listElement6 = createHTMLElement('new-mix__dropdown__element', 'li', 'Свой вариант') as HTMLLIElement;
    containerList.addEventListener('click', this.handlerList);
    list.append(listElement1, listElement2, listElement3, listElement4, listElement5, listElement6);
    containerList.append(selectedElement, list);
    return containerList;
  }

  private createButtonNext(textButton: string) {
    const button = createHTMLElement('new-mix__button-next', 'button', `${textButton}`) as HTMLElement;
    button.addEventListener('click', this.handlerButtonNext);
    return button;
  }

  private async handlerButtonFinish(e?: Event) {
    const fileInputEl = document.getElementById('file-input') as HTMLInputElement;
    const file = (fileInputEl.files as FileList)[0];
    if (e) {
      if (file.size > 1024 * 1024 * 6) {
        alert('Файл превышает лимит (6 MB)');
        e.preventDefault();
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      const addPhoto = document.querySelector('.new-mix__add-photo') as HTMLElement;
      addPhoto.innerHTML = `<img src="${imageUrl}" style="width: 180px; height: 180px; margin-top: -45px">`;
    }
    const mixName = document.querySelector('.new-mix__add-name') as HTMLInputElement;
    const mixDescription = document.querySelector('.new-mix__add-discription') as HTMLInputElement;
    if (mixName.value.length < 4) {
      mixName.style.borderBottomColor = 'red';
      const warning = document.querySelector('.new-mix__warning-info') as HTMLElement;
      warning.innerHTML = 'Название микса должно быть больше 3-х символов';
      return;
    }
    this.newMix.name = mixName.value;
    this.newMix.description = mixDescription.value;
    if (file) {
      this.apiUsers.uploadImage(file).then((data) => {
        this.newMix.image = data.filename;
        this.apiMix.setMyMix(this.newMix);
      });
    } else {
      this.apiMix.setMyMix(this.newMix);
    }
    const infoPage = document.querySelector('.new-mix__info') as HTMLElement;
    setTimeout(() => {
      infoPage.remove();
      window.location.hash = `/account`;
    }, 500);
  }

  private handlerButtonNext(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.textContent !== 'Далее') {
      this.handlerButtonFinish();
      return;
    }
    const inputsPercentage = document.querySelectorAll('.new-mix__flover__input') as NodeListOf<HTMLInputElement>;
    const container = document.querySelector('.user-mixes-container') as HTMLElement;
    let sumInput = 0;
    const warningMessage = createHTMLElement('new-mix__warning', 'div');
    let error = false;
    inputsPercentage.forEach((input) => {
      sumInput += parseFloat(input.value);
      if (parseFloat(input.value) === 0 || input.value === '') {
        error = true;
      }
    });
    if (error) {
      warningMessage.textContent = 'Минимальное значение ввода должно быть не меньше 1%. Проверьте пропорции.';
    } else if (sumInput !== 100) {
      warningMessage.textContent = 'Общая сумма процентов должна составлять 100%. Проверьте пропорции.';
      error = true;
    }
    if (error) {
      container.append(warningMessage);
      inputsPercentage.forEach((input) => {
        input.style.borderColor = 'red';
      });
    } else {
      const newMix: Mix = {
        name: '',
        description: '',
        compositionById: {},
        compositionByPercentage: {},
        image: '',
        id: 0,
        idUser: '',
      };
      inputsPercentage.forEach((input, index) => {
        const flavorKey = `flavor${index + 1}`;
        newMix.compositionByPercentage[flavorKey] = parseFloat(input.value);
      });
      const flovers = getFlavorsInMixer();
      flovers.forEach((flavor, index) => {
        const flavorKey = `flavor${index + 1}`;
        newMix.compositionById[flavorKey] = flavor.id;
      });
      const cupMix = document.querySelector('.new-mix__dropdown__selected span') as HTMLElement;
      const index = cupList.findIndex((item) => item.cup === cupMix.textContent);
      if (index !== -1) {
        newMix.image = cupList[index].imageMix[Math.floor(Math.random() * 2)];
      } else {
        newMix.image = `my-mix-${Math.floor(Math.random() * 8) + 1}.jpg`;
      }
      if (this.userId) newMix.idUser = this.userId;
      this.newMix = newMix;
      this.drawInfo();
    }
  }

  private drawInfo() {
    const container = createHTMLElement(['main__container', 'container', 'new-mix__info'], 'div') as HTMLElement;
    const addPhoto = createHTMLElement('new-mix__add-photo', 'div') as HTMLElement;
    addPhoto.innerHTML = `<img src="${addImgSrc}" class="new-mix__add-img"> <br><span>Картинка микса</span>`;
    addPhoto.addEventListener('click', () => {
      const fileInputEl = document.getElementById('file-input') as HTMLInputElement;
      fileInputEl.click();
      fileInputEl.addEventListener('change', this.handlerButtonFinish);
    });
    const containerName = createHTMLElement('new-mix__name-container', 'div') as HTMLElement;
    const nameSignature = createHTMLElement('new-mix__name-signature', 'div') as HTMLElement;
    nameSignature.innerHTML = `Название микса <span style="color: red;">*</span>`;
    const nameCount = createHTMLElement('new-mix__name-count', 'div', '30') as HTMLElement;
    const inputName = document.createElement('input') as HTMLInputElement;
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('maxlength', '30');
    inputName.classList.add('new-mix__add-name');
    inputName.addEventListener('input', () => {
      nameCount.textContent = `${30 - inputName.value.length}`;
      inputName.style.borderBottomColor = '#898989';
      const warning = document.querySelector('.new-mix__warning-info') as HTMLElement;
      warning.innerHTML = '';
    });
    containerName.append(inputName, nameCount);

    const descriptionSignature = createHTMLElement('new-mix__name-signature', 'div', 'Описание микса') as HTMLElement;
    const containerDescription = createHTMLElement('new-mix__name-container', 'div') as HTMLElement;
    const descriptionCount = createHTMLElement('new-mix__name-count', 'div', '250') as HTMLElement;
    const inputDescription = document.createElement('input') as HTMLInputElement;
    inputDescription.setAttribute('type', 'text');
    inputDescription.setAttribute('maxlength', '250');
    inputDescription.classList.add('new-mix__add-discription');
    inputDescription.addEventListener('input', () => {
      descriptionCount.textContent = `${250 - inputDescription.value.length}`;
    });
    containerDescription.append(inputDescription, descriptionCount);
    const warningMessage = createHTMLElement('new-mix__warning-info', 'div');
    const inputFile = document.createElement('input') as HTMLInputElement;
    inputFile.setAttribute('type', 'file');
    inputFile.setAttribute('accept', '.jpg,.jpeg,.png');
    inputFile.id = 'file-input';
    inputFile.style.display = 'none';
    container.append(
      this.createUserMixesPopupHeader(2),
      this.createButtonNext('Сохранить микс'),
      addPhoto,
      nameSignature,
      containerName,
      descriptionSignature,
      containerDescription,
      warningMessage,
      inputFile
    );
    window.document.body.append(container);
  }

  private handlerList(e: Event) {
    const target = e.target as HTMLElement;
    const dropdown = document.querySelector('.new-mix__dropdown') as HTMLElement;
    const dropdownSelected = dropdown.querySelector('.new-mix__dropdown__selected') as HTMLElement;
    const dropdownList = dropdown.querySelector('.new-mix__dropdown__list') as HTMLElement;
    const changedCup = document.querySelector('.new-mix__dropdown__result') as HTMLElement;
    changedCup.style.top = `${dropdownList.clientHeight}px`;
    if (target === dropdownSelected || target.closest('.new-mix__dropdown__selected')) {
      dropdownList.style.maxHeight = dropdownList.scrollHeight + 'px';
      changedCup.style.top = `310px`;
    }
    if (target.classList.contains('new-mix__dropdown__element')) {
      const selectedText = dropdownSelected.querySelector('span') as HTMLSpanElement;
      selectedText.textContent = target.textContent;
      const imageOnList = dropdownList.querySelector('.new-mix__dropdown__selected-img');
      imageOnList?.remove();
      const image = new Image();
      image.className = 'new-mix__dropdown__selected-img';
      image.src = selectedIcon;
      target.append(image);
      dropdownList.style.maxHeight = 0 + 'px';
      changedCup.style.top = `0px`;
      const index = cupList.findIndex((item) => item.cup === target.textContent);
      if (index !== -1) {
        changedCup.innerHTML = `<img src="${cupList[index].image}" class="new-mix__dropdown__result-image">
                            <span>${cupList[index].description}</span>`;
      } else if (target.textContent === 'Свой вариант') {
        changedCup.innerHTML = '';
        const inputElem = document.createElement('input');
        inputElem.setAttribute('type', 'text');
        inputElem.setAttribute('class', 'new-mix__dropdown__your-option');
        inputElem.setAttribute('id', 'your-option');
        inputElem.setAttribute('placeholder', 'Назва чаші');
        inputElem.setAttribute('maxlength', '50');
        const count = createHTMLElement('new-mix__dropdown__your-option-counter', 'div', '50') as HTMLElement;
        inputElem.addEventListener('input', () => {
          count.textContent = `${50 - inputElem.value.length}`;
        });
        changedCup.append(inputElem, count);
      } else {
        changedCup.innerHTML = '';
      }
    }
  }

  private createUserMixesPopupHeader(type: number) {
    const header = createHTMLElement('user-mixes__header');
    const navBar = createHTMLElement('user-mixes__nav new-mix__nav', 'nav');
    const backArrowImage = new Image();
    backArrowImage.className = 'user-mixes__back-arrow';
    backArrowImage.src = backArrowImgSrc;
    if (type === 1) {
      backArrowImage.onclick = () => history.back();
    } else {
      backArrowImage.onclick = () => {
        const infoPage = document.querySelector('.new-mix__info') as HTMLElement;
        infoPage.remove();
      };
    }
    navBar.append(backArrowImage);
    const heading = createHTMLElement('user-mixes__heading, new-mix__heading', 'h3');
    heading.textContent = type === 1 ? 'Настройки микса' : 'Описание микса';
    navBar.append(heading);
    header.append(navBar);
    return header;
  }
}

export default CreateNewMix;
