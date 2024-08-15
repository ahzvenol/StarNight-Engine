import localforage from 'localforage'

// todo:配置文件处理还没做
// issue 考虑向global_archive底下挂archive?然后存档统一成一个


// function createArchive() {
//     // fix 这里可能也要处理一下了，以后初始化的存档数或许是不固定的
//     const archive = new Array(90).fill({})
//     localforage.setItem('archive', archive)
//     const globalArchive = new Object()
//     localforage.setItem('global_archive', globalArchive)
//     return { archive, globalArchive }
// }
// // tag api有改动,不过与之关联的debug页面删掉了，应该没问题的吧
// function deleteArchive() {
//     localforage.removeItem('archive')
//     localforage.removeItem('global_archive')
// }
// async function initArchive() {
//     let [archive, globalArchive] = await Promise.all([
//         localforage.getItem<Array<any>>('archive'),
//         localforage.getItem<Object>('global_archive')
//     ])
//     if (!archive || !globalArchive) {
//         const { archive: _archive, globalArchive: _globalArchive } = createArchive()
//         archive = _archive
//         globalArchive = _globalArchive
//     }

//     function deepProxy(object: object, handler: ProxyHandler<Object>) {
//         for (let i in object) {
//             if (object[i] instanceof Object) {
//                 object[i] = deepProxy(object[i], handler)
//             }
//         }
//         return new Proxy(object, handler)
//     }

//     // 实际为jsObject(包含Array)
//     function createLocalObject(object: object, localKey: string): any {
//         function set(obj: object, prop: string | symbol, value: any) {
//             if (value instanceof Object) {
//                 value = deepProxy(value, { set })
//             }
//             let flag = Reflect.set(obj, prop, value)
//             localforage.setItem(localKey, object)
//             return flag
//         }
//         return deepProxy(object, { set })
//     }

//     archive = createLocalObject(archive, 'archive')

//     globalArchive = createLocalObject(globalArchive, 'global_archive')

//     return { globalArchive, archive }
// }

function createArchive() {
    // fix:这里可能也要处理一下了，以后初始化的存档数或许是不固定的
    // 考虑使用字典而不是数组的方式，并设置存档显示的默认值
    const archive = { saveData: new Array(90).fill({}), globalData: {} }
    localforage.setItem('archive', archive)
    return JSON.parse(JSON.stringify(archive)) as Dictionary
}
// tag api有改动,不过与之关联的debug页面删掉了，应该没问题的吧
function deleteArchive() {
    localforage.clear()
}

async function initArchive() {
    let archive = await localforage.getItem<Dictionary>('archive').then(e => e || createArchive())

    function deepProxy(object: object, handler: ProxyHandler<object>) {
        for (let i in object) {
            if (object[i] instanceof Object) {
                object[i] = deepProxy(object[i], handler)
            }
        }
        return new Proxy(object, handler)
    }

    function createLocalObject(object: object, localKey: string): any {
        function set(obj: object, prop: string | symbol, value: any) {
            if (value instanceof Object) {
                value = deepProxy(value, { set })
            }
            let flag = Reflect.set(obj, prop, value)
            // Proxy对象不能直接被存储,会导致报错: Failed to execute 'put' on 'IDBObjectStore': [object Object] could not be cloned.
            localforage.setItem(localKey, JSON.parse(JSON.stringify(object)))
            return flag
        }
        return deepProxy(object, { set })
    }

    archive = createLocalObject(archive, 'archive')

    return archive
}

export { createArchive, deleteArchive, initArchive }