import Api from '../components/api/api';
import { getDataFromLS } from './getAllData';
import * as _ from 'lodash';
import { Mixes } from '../components/types/types';

export async function getRandomMixNumber() {
  const api = new Api();
  const mixes = getDataFromLS('mixes') ?? (await api.getAllMixes());
  if (!mixes) return 1;
  return (mixes as Mixes)[_.random(0, mixes.length - 1)] ? (mixes as Mixes)[_.random(0, mixes.length - 1)].id : 1;
}
