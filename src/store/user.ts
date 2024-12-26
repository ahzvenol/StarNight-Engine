import type { IniKV } from './default'
import * as INI from 'js-ini'
import { log } from '@/utils/logger'
import request from '@/utils/request'

// 如果用户输入了错误的配置数据,目前不做处理
export const getUserConfig = async () => {
    const ini = (await request('./config.ini').then((res) => INI.parse(res.data))) as Record<string, IniKV>

    const { system = {}, config = {}, user = {} } = ini

    log.info('配置文件解析完毕:', ini)

    const iniObj = { system, config, user }

    return iniObj
}
