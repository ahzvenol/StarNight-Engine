import { storePromise } from '../store'

export const effect = () =>
    storePromise.then((store) => {
        document.title = store.system().name
    })
