import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useSchedulesStore = create(
    persist(
        (set, get) => ({
            schedules: [],
            loading: false,
            error: null,

            fetchSchedules: async () => {
                // Check if schedules are already cached and not expired
                const cachedSchedules = get().schedules;
                const lastFetched = get().lastFetched;
                const cacheDuration = 3600 * 1000; // 1 hour in milliseconds

                if (cachedSchedules.length > 0 && lastFetched && Date.now() - lastFetched < cacheDuration) {
                    return; // Use cached data
                }

                set({ loading: true, error: null });

                try {
                    const response = await axios.get('/api/schedules', {
                        headers: {
                            'Cache-Control': 'max-age=3600', // Request cached data from backend
                        },
                    });
                    set({
                        schedules: response.data,
                        loading: false,
                        error: null,
                        lastFetched: Date.now(),
                    });
                } catch (error) {
                    set({
                        loading: false,
                        error: error.message || 'Failed to fetch schedules',
                    });
                }
            },

            clearCache: () => {
                set({ schedules: [], lastFetched: null });
            },
        }),
        {
            name: 'schedules-store', // Key for localStorage
            getStorage: () => localStorage, // Persist in localStorage
        }
    )
);

export default useSchedulesStore;