import { act, renderHook } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { useExpand } from './useExpand';

describe('useExpand', () => {
  it('starts collapsed by default', () => {
    const { result } = renderHook(() => useExpand());
    expect(result.current.isOpen).toBe(false);
  });

  it('starts open when given an initial value of true', () => {
    const { result } = renderHook(() => useExpand(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('toggles between open and closed', () => {
    const { result } = renderHook(() => useExpand());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('returns a stable toggle reference across renders', () => {
    const { result, rerender } = renderHook(() => useExpand());
    const firstToggle = result.current.toggle;
    rerender();
    expect(result.current.toggle).toBe(firstToggle);
  });
});
