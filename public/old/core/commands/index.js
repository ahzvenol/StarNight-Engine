import changeBackground from "./scripts/changeBackground";
import changeMessage from './scripts/changeMessage'
import tween from './scripts/shake'
import changeBackgroundMusic from './scripts/changeBackgroundMusic'
import changeSoundEffect from './scripts/changeSoundEffect'
import playVideo from './scripts/playVideo'
import renderSelections from './scripts/renderSelections'
import putCharacter from './scripts/putCharacter'
import closeCharacter from './scripts/closeCharacter'
import wait from './scripts/wait'
import jump from './scripts/jump'
import move from './scripts/move'
import end from './scripts/end'

// todo:在这里将生命周期函数统一处理为function,注意异步函数
// 命令可以有函数或者stateSymbol为key的对象两种形式，第二种形式通过导入lifecycle进行拼接
// 目前的函数不能deepcopy的问题凸显
// tag:考虑柯里化命令（(this)=>({})=>???）来解决问题

const commands = {
    cbg: changeBackground,
    cm: changeMessage,
    t: tween,
    bgm: changeBackgroundMusic,
    se: changeSoundEffect,
    v: playVideo,
    sel: renderSelections,
    pc: putCharacter,
    cc: closeCharacter,
    w: wait,
    j: jump,
    m: move,
    e: end,
}
const commandPrototype = {}

Object.keys(commands).forEach(commandKey => { commands[commandKey].__proto__ = commandPrototype })

export { commands, commandPrototype }