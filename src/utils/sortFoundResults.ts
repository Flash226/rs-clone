import { Brand, Flavor, Mix } from '../components/types/types';

export function sortFoundBrandResultsByTheStringStart(a: Brand, b: Brand, inputValue: string) {
  if (a.name.toLowerCase().startsWith(inputValue)) return -1;
  return 0;
}

export function sortBrandsByPreferences(a: Brand, b: Brand, preferences: string[]) {
  if (!preferences.includes(a.name.toLowerCase()) && preferences.includes(b.name.toLowerCase())) return 1;
  if (preferences.includes(a.name.toLowerCase()) && !preferences.includes(b.name.toLowerCase())) return -1;
  return 0;
}

export function sortFoundFlavorResultsByTheStringStart(a: Flavor, b: Flavor, inputValue: string) {
  if (a.name.toLowerCase().startsWith(inputValue)) return -1;
  return 0;
}

export function sortFlavorsByPreferences(a: Flavor, b: Flavor, preferences: string[]) {
  if (
    !preferences.some((flavorTag) => a.flavor.includes(flavorTag)) &&
    preferences.some((flavorTag) => b.flavor.includes(flavorTag))
  )
    return 1;
  if (
    preferences.some((flavorTag) => a.flavor.includes(flavorTag)) &&
    !preferences.some((flavorTag) => b.flavor.includes(flavorTag))
  )
    return -1;
  return 0;
}

export function sortFoundMixResultsByTheStringStart(a: Mix, b: Mix, inputValue: string) {
  if (a.name.toLowerCase().startsWith(inputValue)) return -1;
  return 0;
}

export function sortFlavorsByStrengthPref(a: Flavor, b: Flavor, strength: string) {
  if (a.strength.toLowerCase() === strength.toLowerCase() && b.strength.toLowerCase() !== strength.toLowerCase())
    return -1;
  if (a.strength.toLowerCase() !== strength.toLowerCase() && b.strength.toLowerCase() === strength.toLowerCase())
    return 1;
  return 0;
}
