import dayjs from 'dayjs'
import { cloneDeep } from 'es-toolkit'

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
type InfoTypes = string | number | boolean | bigint | null | undefined
type ExtraTypes = object | symbol | unknown
class Logger {
    static colors = ['#7799BB', '#009966', '#DD5544', '#CC2233']

    static levels = ['DEBUG', 'INFO', 'WARN', 'ERROR']

    // 当前日志输出级别，默认是 DEBUG
    currentLevel: Level = 'DEBUG'

    clog(level: Level, info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const levelIndex = Logger.levels.indexOf(level)
        const currentLevelIndex = Logger.levels.indexOf(this.currentLevel)
        // 如果当前日志级别优先级低于设置的级别，不输出
        if (levelIndex < currentLevelIndex) return
        console.log(
            `%c[${level}]%c [${dayjs().format('YYYY/MM/DD HH:mm:ss')}] %c${info}`,
            `color:white;background-color:${Logger.colors[levelIndex]}`,
            `color:${Logger.colors[levelIndex]}`,
            ''
        )

        extra.forEach((item) => console.log(cloneDeep(item)))
    }

    debug(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level: Level = 'DEBUG'
        this.clog(level, info, ...extra)
    }

    info(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level: Level = 'INFO'
        this.clog(level, info, ...extra)
    }

    warn(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level: Level = 'WARN'
        this.clog(level, info, ...extra)
    }

    error(info: InfoTypes, ...extra: Array<ExtraTypes>) {
        const level: Level = 'ERROR'
        this.clog(level, info, ...extra)
    }
}

// 不用静态函数是因为代码提示问题
const log = new Logger()

export { log }
