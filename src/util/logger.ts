type Level = "DEBUG" | "INFO" | "WARN" | "ERROR"
class Logger {
    static dic = { DEBUG: '#7799BB', INFO: '#009966', WARN: '#DD5544', ERROR: '#CC2233' }
    static clog(level: Level, info: any) {
        console.log(
            `%c[${level}]%c [${new Date().format("yyyy/MM/dd hh:mm:ss")}] %c${info}`,
            `color:white;background-color:${Logger.dic[level]}`,
            `color:${Logger.dic[level]}`,
            ''
        )
    }
    debug(info: any) {
        const level = 'DEBUG'
        Logger.clog(level, info)
    }
    info(info: any) {
        const level = 'INFO'
        Logger.clog(level, info)
    }
    warn(info: any) {
        const level = 'WARN'
        Logger.clog(level, info)
    }
    error(info: any) {
        const level = 'ERROR'
        Logger.clog(level, info)
    }
}

// 不全改成静态函数是因为代码提示问题
const logger = new Logger()

export default logger