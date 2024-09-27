import { CommandRunFunction } from '@/core/Command'

// 跨幕环境变量name,无副作用
// 存在依赖变量的"文字播放速度"

// 从暂停角度讲这部分还是属于Core
// 与audio命令以及未知音轨参数target存在疑问
// 大概是通过宏混合,另外也是同时独立这个配置出去以免成为系统变量
// name参数是可选的

const text: CommandRunFunction =
    ({ timer, variables }) =>
    ({ text }) => {
        variables.reactive.textView(text)
    }

export const Text = { run: text }

const name: CommandRunFunction =
    ({ variables }) =>
    ({ name }) => {
        if (name !== undefined) {
            variables.reactive.nameView(name)
        }
    }

export const Name = { run: name }
