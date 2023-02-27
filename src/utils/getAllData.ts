import Api from '../components/api/api';
import ApiMix from '../components/api_mix/api_mix';
import ApiUsers from '../components/api_users/apiUsers';
import Preloader from '../components/preloader/preloader';

export async function getAllData() {
  const api = new Api();
  const apiUsers = new ApiUsers();
  const apiMix = new ApiMix();
  localStorage.setItem('brands', JSON.stringify(await api.getAllBrands()));
  localStorage.setItem('mixes', JSON.stringify(await api.getAllMixes()));
  localStorage.setItem('flavors', JSON.stringify(await api.getAllFlavors()));
  localStorage.setItem('lastDbUpdateTime', Date.now().toString());
  localStorage.setItem('top10', JSON.stringify(await api.getTop10()));
  localStorage.setItem('rates', JSON.stringify(await api.getAllRate()));
  localStorage.setItem('popularQueries', JSON.stringify(await apiUsers.searchAccessor()));
  localStorage.setItem('userMixes', JSON.stringify(await apiMix.getAllUsersMix()));
}

export async function isDatabaseOutdated() {
  const api = new Api();
  const preloader = new Preloader();
  preloader.draw();
  const lastTimeUpdated = new Date((await api.getTimeChange()).message);
  const lastTimeUpdatedInLS = getDateFromLS();
  preloader.removePreloader();
  if (!lastTimeUpdatedInLS) return false;
  return lastTimeUpdated >= lastTimeUpdatedInLS;
}

function getDateFromLS() {
  const lastTimeUpdatedInLS = localStorage.getItem('lastDbUpdateTime');
  if (!lastTimeUpdatedInLS) return;
  return new Date(JSON.parse(lastTimeUpdatedInLS));
}

export function isDataInLocalStorage() {
  return (
    localStorage.getItem('brands') !== null &&
    localStorage.getItem('flavors') !== null &&
    localStorage.getItem('mixes') !== null &&
    localStorage.getItem('top10') !== null &&
    localStorage.getItem('rates') !== null &&
    localStorage.getItem('popularQueries') !== null &&
    localStorage.getItem('userMixes') !== null
  );
}

export function getDataFromLS(key: string) {
  const keyInLS = localStorage.getItem(`${key}`);
  if (keyInLS) return JSON.parse(keyInLS);
  return null;
}
