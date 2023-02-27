export function getImgSrc(urlInBrand: string, url: string) {
  return urlInBrand.includes('images') ? url : url.replace('images', '');
}
