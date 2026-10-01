import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import type { MoodType } from './types/moods';
import { usePlantStore } from './store/usePlantStore';

describe('Kinder World 2.0 App', () => {
  beforeEach(() => {
    localStorage.clear();
    usePlantStore.getState().resetPlant();
  });

  it('renders initial state with 🌰 seed plant and question "امروز چه حسی داری؟"', () => {
    render(<App />);
    expect(screen.getByText(/Kinder World/)).toBeInTheDocument();
    expect(screen.getByText('امروز چه حسی داری؟')).toBeInTheDocument();
    expect(screen.getByText('🌰')).toBeInTheDocument();
    expect(screen.getAllByText(/دانه/)[0]).toBeInTheDocument();
  });

  it('displays all 5 mood buttons', () => {
    render(<App />);
    const moodKeys: MoodType[] = ['آرام', 'خسته', 'مضطرب', 'سپاسگزار', 'عصبانی'];
    moodKeys.forEach((key) => {
      expect(screen.getByRole('button', { name: new RegExp(key) })).toBeInTheDocument();
    });
  });

  it('shows exercise modal when a mood button is clicked', () => {
    render(<App />);
    const anxiousBtn = screen.getByRole('button', { name: /مضطرب/ });
    fireEvent.click(anxiousBtn);

    expect(screen.getByText('انتخاب تمرین:')).toBeInTheDocument();
  });

  it('grows plant stage from 🌰 to 🌱 when anxious exercise (10 XP) is completed', () => {
    render(<App />);
    expect(screen.getByText('🌰')).toBeInTheDocument();

    const anxiousBtn = screen.getByRole('button', { name: /مضطرب/ });
    fireEvent.click(anxiousBtn);

    const completeBtn = screen.getByRole('button', { name: /اتمام تمرین و رشد گیاه/ });
    fireEvent.click(completeBtn);

    expect(screen.getAllByText('🌱')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/جوانه/)[0]).toBeInTheDocument();
  });

  it('grows plant stage to 🌿 when reaching 25+ XP and saves to localStorage', () => {
    render(<App />);

    // First exercise (10 XP -> 10 XP Total, Stage 2 🌱)
    fireEvent.click(screen.getByRole('button', { name: /مضطرب/ }));
    fireEvent.click(screen.getByRole('button', { name: /اتمام تمرین و رشد گیاه/ }));

    // Second exercise - select Deep exercise 'anxious-safe-place' (20 XP -> 30 XP Total, Stage 3 🌿)
    fireEvent.click(screen.getByRole('button', { name: /مضطرب/ }));

    const exerciseSelect = screen.getByDisplayValue(/تنفس ۴-۷-۸/);
    fireEvent.change(exerciseSelect, { target: { value: 'anxious-safe-place' } });

    fireEvent.click(screen.getByRole('button', { name: /اتمام تمرین و رشد گیاه/ }));

    expect(screen.getAllByText('🌿')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/نهال جوان/)[0]).toBeInTheDocument();

    const savedState = JSON.parse(localStorage.getItem('kinder_world_plant_state_v2') || '{}');
    expect(savedState.completedExercisesCount).toBe(2);
    expect(savedState.totalXP).toBeGreaterThanOrEqual(25);
  });
});
