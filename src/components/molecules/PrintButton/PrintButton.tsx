import { useCallback } from 'preact/hooks';
import { IconButton } from '../../atoms/IconButton';
import { PrintIcon } from '../../atoms/icons';

export function PrintButton() {
  const onClick = useCallback(() => {
    window.print();
  }, []);

  return (
    <IconButton type="button" onClick={onClick} aria-label="Print" title="Print">
      <PrintIcon />
    </IconButton>
  );
}
