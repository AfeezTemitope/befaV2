import { create } from 'zustand';

const usePlayerOfTheMonthStore = create((set) => ({
    player: null,
    loading: false,
    error: null,
    fetchPlayer: async () => {
        set({ loading: true, error: null });
        try {
            console.log('Fetching player from /api/playerOfTheMonth...');
            const response = await fetch('/api/playerOfTheMonth');
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch player: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            set({ player: data, loading: false });
        } catch (err) {
            console.error('Fetch error:', err);
            set({ error: err.message, loading: false });
        }
    },
}));

export default usePlayerOfTheMonthStore;