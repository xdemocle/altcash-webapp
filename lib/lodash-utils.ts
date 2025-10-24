/**
 * Edge-runtime compatible replacements for lodash functions
 * Avoids dynamic code evaluation issues in edge runtime
 */

export function find<T>(array: T[], predicate: ((item: T) => boolean) | Record<string, any>): T | undefined {
  if (typeof predicate === 'function') {
    return (array as any[]).find(predicate as any);
  }
  // Handle object predicate like { filterType: 'NOTIONAL' }
  return (array as any[]).find(item => {
    for (const key in predicate) {
      if (item[key] !== predicate[key]) {
        return false;
      }
    }
    return true;
  });
}

export function filter<T>(array: T[], predicate: ((item: T) => boolean) | Record<string, any>): T[] {
  if (typeof predicate === 'function') {
    return (array as any[]).filter(predicate as any);
  }
  // Handle object predicate
  return (array as any[]).filter(item => {
    for (const key in predicate) {
      if (item[key] !== predicate[key]) {
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

export function isUndefined(value: any): boolean {
  return value === undefined;
}
