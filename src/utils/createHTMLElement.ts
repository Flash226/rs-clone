export const createHTMLElement = (
  elementClass: string | string[],
  elementName = 'div',
  elementText = ''
): HTMLElement => {
  const element = document.createElement(elementName);

  if (Array.isArray(elementClass)) {
    element.className = elementClass.join(' ');
  } else {
    element.className = elementClass;
  }
  if (elementText) {
    element.textContent = elementText;
  }

  return element;
};
