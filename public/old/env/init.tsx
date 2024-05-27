import axios from "axios"
import createjs from 'createjs-npm'
import { addListener, launch } from 'devtools-detector'
import localforage from 'localforage'
import { initArchive } from '../store/archive'
import { initConfig } from '../store/config'
import '../util/implicit.js'

export default async () => {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED
    createjs.Ticker.framerate = 60

    window.userData = {}
    window.userData.env = process.env.NODE_ENV || 'production'
    window.userData.version = 'StarNight Engine Core4 UI2'
    axios.defaults.baseURL = 'http://localhost:8880'

    if (window.userData.env === 'production') {
        // 生产环境下更改请求地址为页面地址,协议为页面协议
        axios.defaults.baseURL = window.location.protocol + '//' + window.location.host
        // 启动打开控制台检查,如果打开控制台则跳转
        addListener(() => {
            window.location.replace("https://jq.qq.com/?_wv=1027&k=oZJRFpIK")
        })
        launch()
        // 禁用F12
        document.onkeydown = document.onkeyup = document.onkeypress = function () {
            //@ts-ignore
            if (window.event.keyCode == 123) {
                //@ts-ignore
                window.event.returnValue = false
                return false
            }
        }
        // issue:在页面关闭事件中向sw发消息清理缓存?
        // ?或者通过其他方式判断过期来清理缓存
        // tag:暂时不使用service-worker
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('/sw.js', { scope: './assets' }) // 这个scope怎么填是个麻烦事
        //         .then((registration) => {
        //             logger.info('ServiceWorker registration successful with scope: ' + registration.scope)
        //         }).catch((error) => {
        //             logger.error('ServiceWorker registration failed: ' + error.toString())
        //         })
        // }
    }
    // 禁止右键,禁止拖动
    document.oncontextmenu = document.onmousedown = () => {
        return false
    }
    
    // test:
    localforage.config({ name: "GameName" })
    // todo:这里应该可以处理掉了
    // 与设置部分相关联，这里也应改为动态配置方式
    window.userData.backgroundAudio = <audio loop autoplay />
    window.userData.audioClip = <audio autoplay />
    window.userData.se = <audio autoplay />
    // fix 用then的话大概多少有点问题
    // 设置初始化
    const { config, defaultConfig } = await initConfig()
    window.userData.$config = config
    window.userData.$defaultConfig = defaultConfig

    // 存档初始化
    const archive = await initArchive()
    window.userData.$archive = archive

    // 空闲时预加载剧本文件
    document.head.appendChild(<link rel="prefetch" href="" /> as HTMLLinkElement)
}