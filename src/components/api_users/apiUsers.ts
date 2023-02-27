import { Profile } from '../types/types';
import { server } from '../server/server';

class ApiUsers {
  private static instance: ApiUsers;
  private base;
  private registration;
  private login;
  private check;
  private profile;
  private upload;
  private search;
  private flavorPreference;
  constructor() {
    if (ApiUsers.instance) {
      return ApiUsers.instance;
    }
    ApiUsers.instance = this;
    this.base = server;
    this.registration = `${this.base}/auth/registration`;
    this.login = `${this.base}/auth/login`;
    this.check = `${this.base}/auth/check`;
    this.profile = `${this.base}/auth/profile`;
    this.upload = `${this.base}/uploadfile`;
    this.search = `${this.base}/search`;
    this.flavorPreference = `${this.base}/flavorpreference`;
  }

  public async newUser(email: string, password: string) {
    const res = await fetch(`${this.registration}`, {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getAuth(email: string, password: string) {
    const res = await fetch(`${this.login}`, {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async checkAuth(token: string): Promise<boolean> {
    const res = await fetch(`${this.check}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  }

  public async getProfile(id: string): Promise<Profile> {
    const res = await fetch(`${this.profile}`, {
      method: 'POST',
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async setProfile(data: Profile) {
    const res = await fetch(`${this.profile}s`, {
      method: 'POST',
      body: JSON.stringify({
        data,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return JSON.stringify(res);
  }

  public async uploadImage(image: File) {
    const formData: FormData = new FormData();
    formData.append('image', image);
    const res = await fetch(`${this.upload}`, {
      method: 'POST',
      body: formData,
    });
    return await res.json();
  }

  public async searchAccessor(phrase?: string) {
    const res = await fetch(`${this.search}/:${phrase}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async flavorPreferenceAccessor(userId: string, flavors?: string[], strange?: string, brands?: string[]) {
    const res = await fetch(`${this.flavorPreference}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        flavors: flavors,
        strange: strange,
        brands: brands,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }
}

export default ApiUsers;
