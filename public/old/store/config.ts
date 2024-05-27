import localforage from 'localforage'
import { cancleFullScreen, fullScreen } from '../util'
// todo 可以在某处加个语言标识符
// 忘了当时怎么想的了

// todo:对于音频层进行visibilitychange事件统一管理
// todo:暂停时音频层管理?
export const initConfig = async () => {
    const defaultConfig = {
        window: true,
        voice: true,
        ft: false,
        unfast: true,
        globalVolume: 1,
        bgmVolume: 0.5,
        seVolume: 0.7,
        audioClipVolume: 0.7,
        showTextSpeed: 0.5,
        autoReadSpeed: 0.5,
        messageOpacity: 0.3,
    };
    const localConfig = await localforage.getItem<Object>('config') || defaultConfig;
    const raw = {}
    const config = new Proxy(raw, {
        set(obj, prop, value) {
            // issue:使用Reflect的话赋值出错就不会抛出异常了,这是好事吗?
            // obj[prop] = value;
            let flag = Reflect.set(obj, prop, value);
            switch (prop) {
                case 'window':
                    // tag:用户手动触发的全屏并不会引起系统变量的变化,故无法更新对应变量
                    // 看起来我可以劫持用户的F11?但是还有点按钮的方式 // 总之这个是受限的,也不能直接控制浏览器全屏,还是再说
                    if (value) cancleFullScreen()
                    else fullScreen()
                    break;
                case 'globalVolume':
                    window.userData.backgroundAudio.volume = value * (obj['bgmVolume'] ?? 1);
                    window.userData.audioClip.volume = value * (obj['audioClipVolume'] ?? 1);
                    window.userData.se.volume = value * (obj['seVolume'] ?? 1);
                    break;
                case 'bgmVolume':
                    window.userData.backgroundAudio.volume = value * (obj['globalVolume'] ?? 1);
                    break;
                case 'seVolume':
                    window.userData.se.volume = value * (obj['globalVolume'] ?? 1);
                    break;
                case 'audioClipVolume':
                    window.userData.audioClip.volume = value * (obj['globalVolume'] ?? 1);
                    break;
                default:
            }
            localforage.setItem('config', raw);
            return flag;
        },
    });
    for (let key in localConfig) {
        config[key] = localConfig[key];
    }
    // todo:响应式方案需要改动了
    // Vue.observable(config);
    return { defaultConfig, config }
}