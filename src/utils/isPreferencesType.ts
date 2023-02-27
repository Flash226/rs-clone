import { Preferences } from '../components/types/types';

export function isPreferencesType(value: unknown): value is Preferences {
  return (
    value instanceof Object &&
    Object.prototype.hasOwnProperty.call(value, 'flavors') &&
    Object.prototype.hasOwnProperty.call(value, 'strange') &&
    Object.prototype.hasOwnProperty.call(value, 'brands')
  );
}
