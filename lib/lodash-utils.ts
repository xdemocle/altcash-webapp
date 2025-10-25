/**
 * Edge-runtime compatible replacements for lodash functions
 * Avoids dynamic code evaluation issues in edge runtime
 */

export function find<T>(array: T[], predicate: ((item: T) => boolean) | Record<string, unknown>): T | undefined {
  if (typeof predicate === 'function') {
    return array.find(predicate);
  }
  // Handle object predicate like { filterType: 'NOTIONAL' }
  return array.find(item => {
    for (const key in predicate) {
      if ((item as Record<string, unknown>)[key] !== predicate[key]) {
        return false;
      }
    }
    return true;
  });
}

export function filter<T>(array: T[], predicate: ((item: T) => boolean) | Record<string, unknown>): T[] {
  if (typeof predicate === 'function') {
    return array.filter(predicate);
  }
  // Handle object predicate
  return array.filter(item => {
    for (const key in predicate) {
      if ((item as Record<string, unknown>)[key] !== predicate[key]) {
        return false;
      }
    }
    return true;
  });
}

export function each<T>(array: T[] | Record<string, T>, callback: (item: T, keyOrIndex?: number | string) => void): void {
  if (Array.isArray(array)) {
    array.forEach((item, index) => callback(item, index));
  } else {
    Object.entries(array).forEach(([key, value]) => {
      callback(value as T, key);
    });
  }
}

export function isUndefined(value: unknown): boolean {
  return value === undefined;
}
