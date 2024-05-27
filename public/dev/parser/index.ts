function parseINI(data: string) {
    const regex = {
        section: /^\s*\s*([^]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    }
    const value = {}
    const lines = data.split(/\r\n|\r|\n/)
    let section: string | null = null
    lines.forEach(function (line) {
        if (regex.comment.test(line)) {
            return
        } else if (regex.param.test(line)) {
            const match = line.match(regex.param)!
            if (section) {
                value[section][match[1]] = match[2]
            } else {
                value[match[1]] = match[2]
            }
        } else if (regex.section.test(line)) {
            const match = line.match(regex.section)!
            value[match[1]] = {}
            section = match[1]
        } else if (line.length == 0 && section) {
            section = null
        };
    })
    return value
}

import { translate } from "../scala/ts/parser"

export { parseINI, translate }