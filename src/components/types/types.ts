export interface InterfaceContainerElement {
  draw: () => HTMLElement;
}

export interface Brand {
  name: string;
  image: string;
  id: number;
}

export type Brands = Brand[];

export interface Flavor {
  brand: string;
  name: string;
  description: string;
  image: string;
  strength: string;
  flavor: string[];
  id: number;
}

export type Flavors = Flavor[];

export type Composition = { [key: string]: number };

export interface Mix {
  name: string;
  description: string;
  compositionById: Composition;
  compositionByPercentage: Composition;
  image: string;
  id: number;
  idUser?: string;
  userName?: string;
  instagramAccount?: string;
  avatar?: string;
}

export type Mixes = Mix[];

export type FoundResults = {
  foundFlavors: Flavors | null;
  foundMixes: Mixes | null;
  foundBrands: Brands | null;
};

export enum Tabs {
  'Вкусы' = 1,
  'Миксы',
  'Бренды',
  'Подборки',
}

export type TabBtnId = 'tab-btn-1' | 'tab-btn-2' | 'tab-btn-3';

export enum TabBtnIds {
  'tab-btn-1' = 1,
  'tab-btn-2',
  'tab-btn-3',
}

export type SearchCategory = 'flavors' | 'mixes' | 'brands';

export interface PromiseFlavor {
  status: string;
  value?: Flavor;
}
export type PromiseFlavors = PromiseFlavor[];

export interface Profile {
  _id: string;
  userId: string;
  name: string;
  instagramAccount: string;
  avatar: string;
  favorite: number[];
  favoriteFlavors: number[];
  myMix: number[];
  rating: { id: number; rate: number }[];
}
export interface mixRate {
  rate: number;
  vote: number;
}
interface Rate {
  id: number;
  rate: number;
  votes: number;
}
export type Rates = Rate[];

export interface NewFlavor {
  brand: string;
  name: string;
  description: string;
  image: string;
  strength: string;
  flavor: string[];
}

export type DateResponse = {
  message: Date;
};

export type Preferences = {
  flavors: string[];
  strange: string;
  brands: string[];
};
