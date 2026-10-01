import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
}
