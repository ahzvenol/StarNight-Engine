import { StarNight } from 'starnight'
import { onStoreReady } from '@/store'

// 自动存档
StarNight.ActEvents.start.subscribe(async ({ state, current }) => {
    const store = await onStoreReady
    if (!state.isAuto() && !state.isFast()) {
        store.local[0](current())
    }
})
