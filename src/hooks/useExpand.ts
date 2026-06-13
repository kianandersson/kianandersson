import { useCallback, useState } from 'react';

export type UseExpandResult = {
  isOpen: boolean;
  toggle: () => void;
};

export function useExpand(initial = false): UseExpandResult {
  const [isOpen, setOpen] = useState(initial);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  return { isOpen, toggle };
}
