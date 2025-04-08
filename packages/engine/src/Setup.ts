import { Reactive } from 'micro-reactive-solid'
import { Commands } from './types/Command'
import { GameConfig } from './types/Game'
import { Macros } from './types/Marco'
import { PromiseX } from './utils/PromiseX'

// 初始化配置
export const SetupConfig = new PromiseX<Reactive<GameConfig>>()
// 初始化命令表
export const SetupCommands = new PromiseX<Commands>()
// 初始化宏表
export const SetupMarcos = new PromiseX<Macros>()

SetupConfig.then((config) => console.info('Engine:初始化配置为:', config))
SetupCommands.then((cmds) => console.info('Engine:初始化命令表为:', cmds))
SetupMarcos.then((marcos) => console.info('Engine:初始化宏表为:', marcos))
