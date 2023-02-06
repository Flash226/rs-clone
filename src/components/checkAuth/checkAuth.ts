import ApiUsers from '../api/apiUsers';

class CheckAuth {
  private apiUsers;

  constructor() {
    this.apiUsers = new ApiUsers();
  }

  public async checkUserAuth(): Promise<boolean> {
    window.localStorage.clear();
    const localStorage: string | null = window.localStorage.getItem('blender');
    if (localStorage) {
      const token: string = JSON.parse(localStorage);
      return await this.apiUsers.checkAuth(token);
    }
    return false;
  }
}

export default CheckAuth;
