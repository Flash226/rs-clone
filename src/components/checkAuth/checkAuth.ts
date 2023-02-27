import ApiUsers from '../api_users/apiUsers';

class CheckAuth {
  private apiUsers;

  constructor() {
    this.apiUsers = new ApiUsers();
  }

  public async checkUserAuth(): Promise<boolean> {
    const localStorage: string | null = window.localStorage.getItem('blender');
    if (localStorage) {
      const token: string = JSON.parse(localStorage).token;
      return await this.apiUsers.checkAuth(token);
    }
    return false;
  }
}

export default CheckAuth;
