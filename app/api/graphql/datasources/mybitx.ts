import { Pair } from '../types';

class MybitxAPI {
  private baseURL = 'https://api.mybitx.com/api/1';

  async getPair(pair: string): Promise<Pair> {
    const response = await fetch(`${this.baseURL}/ticker?pair=${pair}`);
    return await response.json();
  }
}

export default MybitxAPI;
