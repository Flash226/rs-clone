import Header from '../header/header';
import Footer from '../footer/footer';
import MainPage from '../../pages/mainPage/mainPage';
import SearchPage from '../../pages/searchPage/searchPage';
import MixerPage from '../../pages/mixerPage/mixerPage';
import AccountPage from '../../pages/accountPage/accountPage';
import AccountPageAuth from '../../pages/account_page_auth/accountPageAuth';
import AccountPageEdit from '../../pages/account_page_edit/accountPageEdit';
import MixPage from '../../pages/mixPage/mixPage';
import ErrorPage from '../../pages/errorPage/errorPage';
import { InterfaceContainerElement } from '../types/types';
import { createHTMLElement } from '../../utils/createHTMLElement';
import CheckAuth from '../checkAuth/checkAuth';
import { Catalog } from '../../pages/catalogPage/catalog';
import { BrandSuggest } from '../../pages/brandPage_suggest/brandSuggest';
import { BrandPage } from '../../pages/brandPage/brandPage';
import { isBrandPage } from '../../utils/isBrandPage';
import { UserMixes } from '../userMixes/user-mixes';
import { PreferencesPage } from '../preferences/preferences';
import ProfileUser from '../profile_user/profile_user';
import FavoritePage from '../../pages/favorite_page/favorite_page';
import FavoriteTobaccosPage from '../../pages/favorite_tabacos_page/favorite_tabacos_page';
import MyMixesPage from '../../pages/my_mixes_pages/my_mixes_pages';
import { MixerNowPage } from '../../pages/mixerPage_now/mixer-now';
import { handleChangeOfFlavorsInMixer } from '../../utils/changeFlavorNum';
import ComplitationPage from '../../pages/complitationPage/complitationPage';
import ListComplitationPage from '../../pages/listComplitationPage/listcomplitationPage';
import PopularMixes from '../../pages/popularMixes/popularMixes';
import { FlavorSuggest } from '../../pages/flavorPage_suggest/flavorSuggest';
import { getAllData, isDatabaseOutdated, isDataInLocalStorage } from '../../utils/getAllData';
import Preloader from '../preloader/preloader';
import CreateNewMix from '../../pages/create_new_mix/create_new_mix';

enum LocationPath {
  MainPage = `/`,
  SearchPage = `/search`,
  MixerPage = `/mixer`,
  CatalogPage = `/mixer/brands`,
  CatalogPageCreateNewMix = `/create-new/mixer/brands`,
  CreateNewMix = `/create-new/new`,
  FlavorsSuggestPage = `/flavor-suggest`,
  MixerNowPage = `/mixer/mixer-now`,
  MixerNowPageCreateNewMix = `/create-new/mixer/mixer-now`,
  BrandSuggestPage = `/brand-suggest`,
  PreferencesFlavorsPage = `/mixer/preferences/flavors`,
  PreferencesBrandsPage = `/mixer/preferences/brands`,
  AccountPage = `/account`,
  EditAccount = `/account/edit`,
  FavoritePage = `/account/favorite`,
  FavoriteTobaccosPage = `/account/favorite-tobaccos`,
  MyMixesPage = `/account/my-mixes`,
  UserMixes = `/user-mixes`,
  MixPage = `/mix`,
  ChangePrefFlavors = `/change-pref/flavors`,
  ChangePrefBrands = `/change-pref/brands`,
  ComplitationPage = `/complitation`,
  ListComplitationPage = `/list-complitation`,
  PopularMixes = `/popular-mixes`,
}

class App {
  private root: HTMLElement = document.body;
  private wrapper = createHTMLElement('wrapper');
  private header: InterfaceContainerElement;
  private footer: InterfaceContainerElement;
  private checkAuth;
  private profileUser;

  prevPathPage = '';

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.checkAuth = new CheckAuth();
    localStorage.removeItem('flavorsInMixer');
    this.profileUser = new ProfileUser();
  }

  private async drawNewPage(location: string, startingPreloader?: Preloader) {
    if (!isDataInLocalStorage() || (await isDatabaseOutdated())) {
      const preloader = new Preloader();
      preloader.draw();
      await getAllData();
      preloader.removePreloader();
    }
    if (startingPreloader) startingPreloader.removePreloader();

    this.wrapper.innerHTML = '';

    let changePage: InterfaceContainerElement;

    if (location.length > 1 && location[location.length - 1] === '/') {
      location = location.slice(0, -1);
      window.location.hash = location;
    }

    if (location === LocationPath.MainPage) {
      changePage = new MainPage();
    } else if (location === LocationPath.UserMixes) {
      changePage = new UserMixes();
    } else if (
      location === LocationPath.ChangePrefFlavors ||
      location === LocationPath.ChangePrefBrands ||
      location === LocationPath.PreferencesFlavorsPage ||
      location === LocationPath.PreferencesBrandsPage
    ) {
      changePage = new PreferencesPage();
    } else if (location === LocationPath.SearchPage) {
      changePage = new SearchPage();
    } else if (location === LocationPath.MixerPage) {
      changePage = new MixerPage();
    } else if (location === LocationPath.CatalogPage || location === LocationPath.CatalogPageCreateNewMix) {
      changePage = new Catalog();
    } else if (location === LocationPath.FlavorsSuggestPage) {
      changePage = new FlavorSuggest();
    } else if (location === LocationPath.MixerNowPage || location === LocationPath.MixerNowPageCreateNewMix) {
      changePage = new MixerNowPage();
    } else if (location === LocationPath.BrandSuggestPage) {
      changePage = new BrandSuggest();
    } else if (location.includes(LocationPath.CatalogPage)) {
      changePage = (await isBrandPage()) ? new BrandPage() : new ErrorPage();
    } else if (location === LocationPath.AccountPage) {
      if ((await this.checkAuth.checkUserAuth()) === true) {
        changePage = new AccountPageAuth();
      } else {
        changePage = new AccountPage();
      }
    } else if (location === LocationPath.EditAccount) {
      if ((await this.checkAuth.checkUserAuth()) === true) {
        changePage = new AccountPageEdit();
      } else {
        changePage = new AccountPage();
      }
    } else if (location === LocationPath.FavoritePage) {
      if ((await this.checkAuth.checkUserAuth()) === true) {
        changePage = new FavoritePage();
      } else {
        changePage = new AccountPage();
      }
    } else if (location === LocationPath.CreateNewMix && (await this.checkAuth.checkUserAuth()) === true) {
      changePage = new CreateNewMix();
    } else if (location === LocationPath.ListComplitationPage) {
      changePage = new ListComplitationPage();
    } else if (location.includes(LocationPath.ComplitationPage)) {
      changePage = new ComplitationPage();
    } else if (location === LocationPath.PopularMixes) {
      changePage = new PopularMixes();
    } else if (location === LocationPath.FavoriteTobaccosPage) {
      if ((await this.checkAuth.checkUserAuth()) === true) {
        changePage = new FavoriteTobaccosPage();
      } else {
        changePage = new AccountPage();
      }
    } else if (location === LocationPath.MyMixesPage) {
      if ((await this.checkAuth.checkUserAuth()) === true) {
        changePage = new MyMixesPage();
      } else {
        changePage = new AccountPage();
      }
    } else if (location.includes(LocationPath.MixPage)) {
      changePage = new MixPage();
    } else if (location === ``) {
      window.location.hash = `#/`;
      changePage = new MainPage();
    } else {
      changePage = new ErrorPage();
    }

    if (changePage) {
      this.prevPathPage = window.location.hash.slice(1);
      if (this.wrapper.innerHTML.length === 0) {
        this.wrapper.append(changePage.draw());
      }
    }
  }

  private handleHashChange(preloader: Preloader): void {
    window.addEventListener('hashchange', () => this.loadHashPage());
    window.addEventListener('load', () => {
      this.loadHashPage(preloader);
    });
  }

  private loadHashPage = (preloader?: Preloader): void => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      window.location.hash = `/`;
    }
    this.drawNewPage(hash, preloader);
    handleChangeOfFlavorsInMixer();
  };

  async start(): Promise<void> {
    const startingPreloader = new Preloader();
    startingPreloader.draw();
    const localStorageStartProfile: string | null = window.localStorage.getItem('blenderStartProfile');
    if (!localStorageStartProfile) this.profileUser.getStartProfile();
    localStorage.setItem('lastDbUpdateTime', Date.now().toString());
    this.root.append(this.header.draw(), this.wrapper, this.footer.draw());
    this.handleHashChange(startingPreloader);
  }
}

export default App;
