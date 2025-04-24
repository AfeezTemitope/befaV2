import { create } from 'zustand';

const CACHE_KEY = 'schedules_cache';
const CACHE_TTL = 3600 * 1000; // 1 hour in ms

const useSchedulesStore = create((set) => ({
    schedules: [],
    loading: false,
    error: null,
    fetchSchedules: async () => {
        set({ loading: true, error: null });
        try {
            // Check local cache
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) {
                    set({ schedules: data, loading: false });
                    return;
                }
            }

            // Fetch from backend
            const response = await fetch('/api/schedule');
            if (!response.ok) {
                throw new Error('Failed to fetch schedules');
            }
            const data = await response.json();
            set({ schedules: data, loading: false });

            // Update local cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));

export default useSchedulesStore;