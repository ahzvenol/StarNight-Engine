import { onStoreReady } from '..'

onStoreReady.then((store) => {
    document.title = store().system.name
})
