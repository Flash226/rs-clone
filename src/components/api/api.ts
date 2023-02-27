import { Brands, DateResponse, Flavor, Flavors, Mix, Mixes, NewFlavor, Rates } from '../types/types';
import { server } from '../server/server';

class Api {
  private static instance: Api;
  private base;
  private brands;
  private flavors;
  private mixes;
  private randomMix;
  private top10;
  private allRate;
  constructor() {
    if (Api.instance) {
      return Api.instance;
    }
    Api.instance = this;
    this.base = server;
    this.brands = `${this.base}/api/brands`;
    this.flavors = `${this.base}/api/flavors`;
    this.mixes = `${this.base}/api/mixes`;
    this.randomMix = `${this.base}/api/randommix`;
    this.top10 = `${this.base}/api/top10`;
    this.allRate = `${this.base}/api/allrate`;
  }

  public async getAllBrands(): Promise<Brands> {
    const res = await fetch(`${this.brands}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getAllFlavors(): Promise<Flavors> {
    const res = await fetch(`${this.flavors}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getFlavor(id: number): Promise<Flavor> {
    const res = await fetch(`${this.flavors}/:${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getAllMixes(): Promise<Mixes> {
    const res = await fetch(`${this.mixes}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getMix(id: number): Promise<Mix> {
    const res = await fetch(`${this.mixes}/:${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public getImage(image: string): string {
    image = image.slice(image.lastIndexOf('/', image.lastIndexOf('/') - 1) + 1);
    return `${this.base}/images/${image}`;
  }

  public async setNewBrand(name: string, imageName: string) {
    const res = await fetch(`${this.brands}`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        imageName: imageName,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async setNewFlavor(newFlavor: NewFlavor) {
    const res = await fetch(`${this.flavors}`, {
      method: 'POST',
      body: JSON.stringify(newFlavor),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getRandomMix() {
    const res = await fetch(`${this.randomMix}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getTop10() {
    const res = await fetch(`${this.top10}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getAllRate(): Promise<Rates> {
    const res = await fetch(`${this.allRate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }

  public async getTimeChange(): Promise<DateResponse> {
    const res = await fetch(`${this.base}/change-time`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }
}
export default Api;
