import { parse } from 'js-ini'
import { IniKV } from './default'
import { logger } from '@/utils/Logger'

// 如果用户输入了错误的配置数据,目前不做处理
export const getUserConfig = async () => {
    const ini = (await fetch('./config.ini')
        .then((res) => res.text())
        .then(parse)) as Record<string, IniKV>

    const { info = {}, graphic = {}, config = {}, user = {} } = ini

    const system = { ...info, ...graphic }

    logger.info('配置文件解析完毕:', ini)

    const iniObj = { system, config, user }

    return iniObj
}
