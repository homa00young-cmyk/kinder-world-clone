import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { MOODS, type MoodType } from './types/moods';

describe('Kinder World Clone App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial state with 🌱 plant and question "امروز چه حسی داری؟"', () => {
    render(<App />);
    expect(screen.getByText('Kinder World')).toBeInTheDocument();
    expect(screen.getByText('امروز چه حسی داری؟')).toBeInTheDocument();
    expect(screen.getByText('🌱')).toBeInTheDocument();
    expect(screen.getByText(/جوانه/)).toBeInTheDocument();
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

    expect(screen.getByText(`"${MOODS['مضطرب'].exercise}"`)).toBeInTheDocument();
  });

  it('grows plant stage from 🌱 to 🌿 when exercise is completed', () => {
    render(<App />);
    expect(screen.getByText('🌱')).toBeInTheDocument();

    const calmBtn = screen.getByRole('button', { name: /آرام/ });
    fireEvent.click(calmBtn);

    const completeBtn = screen.getByRole('button', { name: /اتمام تمرین و رشد گیاه/ });
    fireEvent.click(completeBtn);

    expect(screen.getByText('🌿')).toBeInTheDocument();
    expect(screen.getByText(/نهال/)).toBeInTheDocument();
  });

  it('grows plant stage to 🌳 on second completed exercise and saves to localStorage', () => {
    render(<App />);

    // First exercise
    fireEvent.click(screen.getByRole('button', { name: /آرام/ }));
    fireEvent.click(screen.getByRole('button', { name: /اتمام تمرین و رشد گیاه/ }));

    // Second exercise
    fireEvent.click(screen.getByRole('button', { name: /خسته/ }));
    fireEvent.click(screen.getByRole('button', { name: /اتمام تمرین و رشد گیاه/ }));

    expect(screen.getByText('🌳')).toBeInTheDocument();
    expect(screen.getByText(/درخت تنومند/)).toBeInTheDocument();

    const savedState = JSON.parse(localStorage.getItem('kinder_world_plant_state_v1') || '{}');
    expect(savedState.stageIndex).toBe(2);
  });
});
