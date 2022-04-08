export interface ComponentProps<T> {
  initialState: T;
  $parent: Element;
  onClick?: (event: MouseEvent) => void;
}
