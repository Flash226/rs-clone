import Api from '../components/api/api';
import Preloader from '../components/preloader/preloader';
import { Brand } from '../components/types/types';

export async function isBrandPage() {
  const loader = new Preloader();
  loader.draw();
  const BrandsInLS = localStorage.getItem('brands');
  const BRANDS = BrandsInLS
    ? JSON.parse(BrandsInLS).map((brand: Brand) => brand.name.toLowerCase())
    : (await new Api().getAllBrands()).map((brand) => brand.name.toLowerCase());
  const locationArr = window.location.hash.replace('create-new/', '').split('/');
  loader.removePreloader();
  if (locationArr.length !== 4 || locationArr[0] !== '#' || locationArr[1] !== 'mixer' || locationArr[2] !== 'brands')
    return false;
  return BRANDS.includes(decodeURI(locationArr[3]));
}
