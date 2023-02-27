import ApiUsers from '../api_users/apiUsers';
import { Profile } from '../types/types';

class ProfileUser {
  private apiUsers;

  constructor() {
    this.apiUsers = new ApiUsers();
  }

  public getUserId(): string | false {
    let userId: string;
    const localStorageAuth: string | null = window.localStorage.getItem('blender');
    if (localStorageAuth) {
      userId = JSON.parse(localStorageAuth).userId;
      return userId;
    } else {
      const localStorageNoAuth: string | null = window.localStorage.getItem('blenderStartProfile');
      if (localStorageNoAuth) {
        userId = JSON.parse(localStorageNoAuth).userId;
        return userId;
      }
    }
    return false;
  }

  public async getProfile(): Promise<Profile | false> {
    const localStorageProfile: string | null = window.localStorage.getItem('blenderProfile');
    if (localStorageProfile) {
      const localProfile: Profile = JSON.parse(localStorageProfile);
      return localProfile;
    }
    const profile = await this.updateProfile();
    if (profile !== undefined) {
      return profile;
    }
    return false;
  }

  public async getStartProfile(): Promise<Profile | false> {
    function createRandomString(sumString: number) {
      const symbolArr = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
      let randomString = '';
      for (let i = 0; i < sumString; i++) {
        const index = Math.floor(Math.random() * symbolArr.length);
        randomString += symbolArr[index];
      }
      return randomString;
    }

    const profile = await this.apiUsers.getProfile(createRandomString(12));
    if (profile !== undefined) {
      window.localStorage.setItem('blenderStartProfile', JSON.stringify(profile));
      return profile;
    }
    return false;
  }

  public async updateProfile() {
    const userId = this.getUserId();
    if (typeof userId === 'string') {
      const data = await this.apiUsers.getProfile(userId);
      if (userId.length > 12) {
        window.localStorage.setItem('blenderProfile', JSON.stringify(data));
      } else {
        window.localStorage.setItem('blenderStartProfile', JSON.stringify(data));
      }
      return data;
    }
  }

  public async setProfile(profile: Profile) {
    window.localStorage.setItem('blenderProfile', JSON.stringify(profile));
    this.apiUsers.setProfile(profile);
  }
}

export default ProfileUser;
