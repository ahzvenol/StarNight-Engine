import * as INI from 'js-ini'
import { IniKV } from './default'
import { log } from '@/utils/Logger'
import request from '@/utils/request'

// 如果用户输入了错误的配置数据,目前不做处理
export const getUserConfig = async () => {
    const ini = (await request('./config.ini').then((res) => INI.parse(res.data))) as Record<string, IniKV>

    const { info = {}, graphic = {}, config = {}, user = {} } = ini

    const system = { ...info, ...graphic }

    log.info('配置文件解析完毕:', ini)

    const iniObj = { system, config, user }

    return iniObj
}
