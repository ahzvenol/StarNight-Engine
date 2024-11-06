import { storePromise } from '../store'

storePromise.then((store) => {
    document.title = store.system().name
})
