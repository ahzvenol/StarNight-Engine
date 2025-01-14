import type { IniKV } from './default'
import * as INI from 'js-ini'
import { log } from '@/utils/logger'
import request from '@/utils/request'

// 如果用户输入了错误的配置数据,目前不做处理
export const getUserConfig = async () => {
    try {
        const data = await request('./config.ini').then((res) => INI.parse(res.data))
        log.info('用户配置文件解析完毕:', data)
        return data as Record<string, IniKV>
    } catch (error) {
        log.warn('没有获取到用户配置', error)
        return {}
    }
}
