import { Metadata } from '~/graphql/types';
import missingsJson from '../data/missings.json';
import namesJson from '../data/names.json';

class NamesAPI {
  async getAll() {
    const arr: Metadata[] = [];

    for (const [key, value] of Object.entries(namesJson)) {
      arr.push({
        id: key,
        symbol: key,
        name: value.name,
        slug: value.slug,
        description: value.description,
        logo: value.logo,
      });
    }

    missingsJson.forEach(missing => {
      arr.push({
        id: missing.symbol,
        symbol: missing.symbol,
        name: missing.name,
        slug: missing.name.toLowerCase(),
        description: 'n/d',
        logo: missing.logo,
      });
    });

    return arr;
  }
}

export default NamesAPI;
