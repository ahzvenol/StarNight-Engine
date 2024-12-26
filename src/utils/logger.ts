import dayjs from 'dayjs'

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
type InfoTypes = string | number | boolean | bigint | null | undefined
type ExtraTypes = object | symbol | unknown
class Logger {
    static dic = { DEBUG: '#7799BB', INFO: '#009966', WARN: '#DD5544', ERROR: '#CC2233' }
    static clog(level: Level, info: InfoTypes, ...extra: Array<ExtraTypes>) {
        console.log(
            `%c[${level}]%c [${dayjs().format('YYYY/MM/DD HH:mm:ss')}] %c${info}`,
            `color:white;background-color:${Logger.dic[level]}`,
            `color:${Logger.dic[level]}`,
            ''
        )

        extra.forEach((item) => console.log(item))
    }
    debug(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level = 'DEBUG'
        Logger.clog(level, info, ...extra)
    }
    info(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level = 'INFO'
        Logger.clog(level, info, ...extra)
    }
    warn(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level = 'WARN'
        Logger.clog(level, info, ...extra)
    }
    error(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level = 'ERROR'
        Logger.clog(level, info, ...extra)
    }
}

// 不全改成静态函数是因为代码提示问题
const log = new Logger()

export { log }
