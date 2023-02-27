import ProfileUser from '../profile_user/profile_user';
import { server } from '../server/server';
import { mixRate, Mix } from '../types/types';

class ApiMix {
  private static instance: ApiMix;
  private base;
  private rate;
  private favorite;
  private favoriteFlavor;
  private brand;
  private profileUser;
  private myMix;

  constructor() {
    if (ApiMix.instance) {
      return ApiMix.instance;
    }
    ApiMix.instance = this;
    this.base = server;
    this.rate = `${this.base}/auth/rate/`;
    this.favorite = `${this.base}/auth/favorite/`;
    this.favoriteFlavor = `${this.base}/auth/favoriteflavor/`;
    this.brand = `${this.base}/auth/brand/`;
    this.myMix = `${this.base}/auth/my-mix/`;
    this.profileUser = new ProfileUser();
  }

  public async getRate(id: number): Promise<mixRate> {
    const res = await fetch(`${this.rate}:${id}`, {
      method: 'GET',
    });
    return await res.json();
  }

  public async setRate(userId: string, id: number, rate: number) {
    if (typeof userId === 'string') {
      const res = await fetch(`${this.rate}`, {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          id: id,
          rate: rate,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.profileUser?.updateProfile();
      return await res.json();
    }
  }

  public getVote(id: number) {
    const localStorageAuth: string | null = window.localStorage.getItem('blenderProfile');
    const localStorageNoAuth: string | null = window.localStorage.getItem('blenderStartProfile');
    let votes;
    let rate = 0;
    if (localStorageNoAuth) {
      votes = JSON.parse(localStorageNoAuth).rating;
      votes.forEach((el: { id: number; rate: number }) => {
        if (el.id === id) rate = el.rate;
      });
    }
    if (localStorageAuth) {
      votes = JSON.parse(localStorageAuth).rating;
      votes.forEach((el: { id: number; rate: number }) => {
        if (el.id === id) rate = el.rate;
      });
    }
    return rate;
  }

  public async getFavorite(userId: string) {
    const localStorageAuth: string | null = window.localStorage.getItem('blenderProfile');
    if (localStorageAuth) {
      const favorite = JSON.parse(localStorageAuth).favorite;
      return favorite;
    }
    const res = await fetch(`${this.favorite}:${userId}`, {
      method: 'GET',
    });
    return await res.json();
  }

  public async setFavorite(userId: string, id: number) {
    if (typeof userId === 'string') {
      const res = await fetch(`${this.favorite}`, {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          id: id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.profileUser?.updateProfile();
      return await res.json();
    }
  }

  public async getFavoriteFlavors(userId: string) {
    const localStorageAuth: string | null = window.localStorage.getItem('blenderProfile');
    if (localStorageAuth) {
      const favoriteFlavors = JSON.parse(localStorageAuth).favoriteFlavors;
      return favoriteFlavors;
    }
    const res = await fetch(`${this.favoriteFlavor}:${userId}`, {
      method: 'GET',
    });
    return await res.json();
  }

  public async setFavoriteFlavor(userId: string, id: number) {
    if (typeof userId === 'string') {
      const res = await fetch(`${this.favoriteFlavor}`, {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          id: id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.profileUser?.updateProfile();
      return await res.json();
    }
  }

  public async getAllUsersMix() {
    const res = await fetch(`${this.base}/auth/mix-users-all`, {
      method: 'GET',
    });
    return await res.json();
  }

  public async getMyMix(userId: string) {
    const localStorageAuth: string | null = window.localStorage.getItem('blenderProfile');
    if (localStorageAuth) {
      const myMix = JSON.parse(localStorageAuth).myMix;
      return myMix;
    }
    const res = await fetch(`${this.myMix}:${userId}`, {
      method: 'GET',
    });
    return await res.json();
  }

  public async setMyMix(newMix: Mix) {
    const res = await fetch(`${this.myMix}`, {
      method: 'POST',
      body: JSON.stringify(newMix),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.profileUser?.updateProfile();
    return await res.json();
  }
}

export default ApiMix;
