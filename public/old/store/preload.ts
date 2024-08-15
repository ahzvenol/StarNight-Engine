import axios from "axios"
import book from '../assets/book.json'
import { to } from "../util"

// tag:需要预载的参数,与脚本同步更新
// const preLoadArgs = ["cbg.p", "cm.a", "bgm.a", "se.a", "v.v", "pc.p"]
const preLoadArgs = ["cbg.p", "cm.a", "bgm.a", "se.a", "pc.p"]

// 不是很清楚缓存需不需要主动取
const preLoadResources:Dictionary<HTMLImageElement> = {}

// todo url不采取全称而要改用资源名的格式自由拼装

// todo 这部分也该重写了

// for (let index = 0; index < 10; index++) {
//     // fix 想实现同时等待十个的效果，现在阻塞时间过长了
//     await axios.get(`/data/CDN${index}.json`)
//         .then(res => {
//             cdnArray[index] = res.data
//         })
// }
// fix 仍然报错net::ERR_CONNECTION_REFUSED，需要阻止报错
// 这个报错看起来是阻止不了的

// 请求10个文件过于耗费资源,CDN映射限制改为三个
// tag:这里也可以使用(可选)配置文件的形式
const promiseArray = to(1, 3).map(index => axios.get(`/data/CDN${index}.json`).catch(_ => { }))
// fix 不能用await
// const res = await axios.all(promiseArray) as Array<axios.Response | undefined>
const cdnArrayPromise = (async () => {
    const res = await axios.all(promiseArray)
    const cdnArray = res.filter(e => e).map(e => e!.data)
    return cdnArray as Array<Object>
})()

// issue:考虑之后是不是使用ServiceWorker或者其他方式让预载和逻辑完全分离

// image标签没有跨域问题,所以使用这个方式来进行预载
function downloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
            image.onload = null
            resolve(image)
        }
        image.onerror = () => { reject() }
        image.src = url
    })
}

// issue:考虑使用prefetch进行简化? 注意重复问题

function preLoad(rowIndex: number) {
    logger.info(`预加载第${rowIndex}幕`)
    // 循环该幕的每个命令
    for (let i of book[rowIndex]) {
        for (let key in i) {
            // 找到需要预载的命令参数
            if (!preLoadArgs.includes(`${i['@']}.${key}`)) continue
            const fileName = i[key] as string
            // 如果已经预加载过或是空值,则退出
            // fix:不是所有资源都在preLoadResources里,这个判断应该有问题
            if (preLoadResources[fileName] || !fileName) continue
            logger.info(`预加载资源:'${fileName}'`)
            // 只有图片格式才应该放入缓存中备用,其他格式请求一次后浏览器会自动命中缓存
            // fix 这里关于图片格式的判断是有问题的
            // tag:./static/问题需要统计各处资源引用情况再行全局替换
            if (fileName.match(/\.(jpg|png|gif|svg|bmp|ico|webp)/)) {
                (async () => {
                    const cdnArray = await cdnArrayPromise
                    // 考虑到用户的网络情况不同，不使用Promise.any方式(加载所有资源镜像并使用最先加载完成的)
                    for (const cdn of cdnArray.concat([{ fileName }])) {
                        await downloadImage(cdn[fileName]).then((res) => {
                            preLoadResources[fileName] = res
                        }).catch(_ => { })
                        if (preLoadResources[fileName]) break
                    }
                    // tag 这个是不是应该放在函数里面
                    if (!preLoadResources[fileName]) logger.error(`预加载资源:'${fileName}'失败`)
                })()
            } else {
                axios.get(fileName)
                    .catch(_ => {
                        logger.error(`预加载资源:'${fileName}'失败`)
                    })
            }
        }
    }
}


function getResource(fileName: string) {
    return preLoadResources[fileName]
}

export { preLoad, getResource }
