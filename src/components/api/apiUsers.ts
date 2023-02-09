import { Profile } from '../types/types';

class ApiUsers {
  private static instance: ApiUsers;
  private base;
  private registration;
  private login;
  private check;
  private profile;
  private upload;
  constructor() {
    if (ApiUsers.instance) {
      return ApiUsers.instance;
    }
    ApiUsers.instance = this;
    this.base = 'http://localhost:3002';
    this.registration = `${this.base}/auth/registration`;
    this.login = `${this.base}/auth/login`;
    this.check = `${this.base}/auth/check`;
    this.profile = `${this.base}/auth/profile`;
    this.upload = `${this.base}/uploadfile`;
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
    console.log(await res.json());
  }

  public async uploadImage(image: File) {
    const formData: FormData = new FormData();
    formData.append('image', image);
    console.log(1111, formData.get('image'))
    const res = await fetch(`${this.upload}`, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
      body: formData,
    });
    return await res.json();
  }
}


export default ApiUsers;
