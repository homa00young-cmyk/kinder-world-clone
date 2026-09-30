import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InstallButton } from './InstallButton';

describe('InstallButton Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders install button when device is mobile or window width is small', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    window.dispatchEvent(new Event('resize'));

    render(<InstallButton />);
    expect(screen.getByText('نصب اپلیکیشن Kinder World')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'نصب اپ' })).toBeInTheDocument();
  });

  it('handles beforeinstallprompt event and invokes prompt() when clicked', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });

    const promptSpy = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });

    const beforeInstallEvent = new Event('beforeinstallprompt') as any;
    beforeInstallEvent.prompt = promptSpy;
    beforeInstallEvent.userChoice = mockUserChoice;

    render(<InstallButton />);

    act(() => {
      window.dispatchEvent(beforeInstallEvent);
    });

    const installBtn = screen.getByRole('button', { name: 'نصب اپ' });

    await act(async () => {
      fireEvent.click(installBtn);
    });

    await waitFor(() => {
      expect(promptSpy).toHaveBeenCalled();
    });
  });

  it('dismisses when close button is clicked', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });

    render(<InstallButton />);
    const closeBtn = screen.getByRole('button', { name: 'بستن' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('نصب اپلیکیشن Kinder World')).not.toBeInTheDocument();
  });
});
