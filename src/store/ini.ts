import { parse } from 'js-ini'
import { IniKV } from './default'
import { logger } from '@/utils/Logger'

const iniDemo = `
; 系统通用配置
[info]
name=demo
version=StarNight Engine 3 Years

[graphic]
width=1280
height=720
mode=auto

[config]
GolbalVolume=1
BGMVolume=1
SEVolume=1
ClipVolume=1
UISEVolume=1
language=zh-CN

; 用户配置
[user]
v1=1
v2=""
v3=true
`

// 如果用户输入了错误的配置数据,目前不做处理
export const getUserIni = async () => {
    const ini = parse(iniDemo) as Record<string, IniKV>

    const { info = {}, graphic = {}, config = {}, user = {} } = ini

    const system = { ...info, ...graphic }

    logger.info('配置文件解析完毕:', ini)

    const iniObj = { system, config, user }

    return iniObj
}
