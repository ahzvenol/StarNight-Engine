type Level = "DEBUG" | "INFO" | "WARN" | "ERROR"
type InfoTypes = string | number | boolean | null | undefined | bigint
type ExtraTypes = Object | Function | Array<unknown> | symbol
class Logger {
    static dic = { DEBUG: '#7799BB', INFO: '#009966', WARN: '#DD5544', ERROR: '#CC2233' }
    static clog(level: Level, info: InfoTypes, extra?: ExtraTypes) {
        console.log(
            `%c[${level}]%c [${new Date().format("yyyy/MM/dd hh:mm:ss")}] %c${info}`,
            `color:white;background-color:${Logger.dic[level]}`,
            `color:${Logger.dic[level]}`,
            '',
        )
        if (extra) console.log(extra)
    }
    debug(info: InfoTypes, extra?: ExtraTypes) {
        const level = 'DEBUG'
        Logger.clog(level, info, extra)
    }
    info(info: InfoTypes, extra?: ExtraTypes) {
        const level = 'INFO'
        Logger.clog(level, info, extra)
    }
    warn(info: InfoTypes, extra?: ExtraTypes) {
        const level = 'WARN'
        Logger.clog(level, info, extra)
    }
    error(info: InfoTypes, extra?: ExtraTypes) {
        const level = 'ERROR'
        Logger.clog(level, info, extra)
    }
}

// 不全改成静态函数是因为代码提示问题
const logger = new Logger()

export default logger