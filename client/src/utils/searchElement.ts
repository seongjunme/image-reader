export const searchChildren = ({
  element,
  targetTagName,
}: {
  element: HTMLElement;
  targetTagName: string;
}) => {
  const { children } = element;
  const filterdNodes = Array.prototype.filter.call(
    children,
    (node) => node.tagName === 'IMG',
  );
  console.log(filterdNodes);
};

export const searchSiblingNodes = () => {};
