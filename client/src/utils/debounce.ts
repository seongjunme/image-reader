const debounce = (callback: (...arg: any) => void, delay: number) => {
  let timer: NodeJS.Timeout;

  return (...arg: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...arg), delay);
  };
};

export default debounce;
