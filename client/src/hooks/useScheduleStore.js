import { create } from 'zustand';

const useSchedulesStore = create((set) => ({
    schedules: [],
    loading: false,
    error: null,
    fetchSchedules: async () => {
        set({ loading: true, error: null });
        try {
            console.log('Fetching schedules from /api/schedule...');
            const response = await fetch('/api/schedule');
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch schedules: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            set({ schedules: data, loading: false });
        } catch (err) {
            console.error('Fetch error:', err);
            set({ error: err.message, loading: false });
        }
    },
}));

export default useSchedulesStore;