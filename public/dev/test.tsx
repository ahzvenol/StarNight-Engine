import type { Reactive } from "micro-reactive"
import { useReactive } from "micro-reactive"
import { Component, JSX, splitProps } from "solid-js"
import { createEffect } from "solid-js"
import { ObjectUtils } from "../util"

const VariableMap: Dictionary<Reactive<VariableType>> = {}

const defaultConfig: Dictionary = {}

type VariableType = string | number | boolean

type VariableTypeString = 'string' | 'number' | 'boolean'

type ArithmeticOperator = "+" | "-" | "*" | "/"

const Variable: Component<{ name: string, type: VariableTypeString, defaultValue: string }> =
    ({ name, type, defaultValue }) => {
        const converter = { 'string': String, 'number': Number, 'boolean': Boolean }
        defaultConfig[name] = converter[type](defaultValue)
        VariableMap[name] = useReactive(converter[type](defaultValue))
        return <></>
    }

const Computation: Component<{ name: string, type: ArithmeticOperator, valueAName: string, valueBName: string }> =
    ({ name, type: operator, valueAName, valueBName }) => {
        const operations: Dictionary<(a: VariableType | any, b: VariableType | any) => VariableType> = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
        }
        VariableMap[name] = () => operations[operator](VariableMap[valueAName](), VariableMap[valueBName]())
        return <></>
    }

const variableExample = <Variable name="foo" type="string" defaultValue="1" />

// const computationExample1 = <Computation name="computation1" type="+">
//     <Variable name="foo" type="number" defaultValue="1" />
//     <Variable name="bar" type="number" defaultValue="1" />
// </Computation>
// 展开为
// <Variable name="foo" type="number" defaultValue="1" />
// <Variable name="bar" type="number" defaultValue="1" />
// <Computation name="computation1" type="+" a="foo" b="bar"/>


// const computationExample2 = <Computation name="computation1" type="+">
//     <Variable name="foo" type="number" defaultValue="1" />
//     <Computation name="computation2" type="+">
//         <Variable name="bar" type="number" defaultValue="1" />
//         <Variable name="baz" type="number" defaultValue="1" />
//     </Computation>
// </Computation>
// 展开为
// <Variable name="foo" type="number" defaultValue="1" />
// <Variable name="bar" type="number" defaultValue="1" />
// <Variable name="baz" type="number" defaultValue="1" />
// <Computation name="computation2" type="+" a="bar" b="baz"/>
// <Computation name="computation1" type="+" a="foo" b="computation2"/>

// 可以通过预分组来解决变量初始化前就被求值的问题

class AudioManager {

    private globalMuted = false

    private audioTracks: Dictionary<HTMLAudioElement> = {};

    // 创建新的音频轨道
    createAudioTrack(trackName: string, src: string) {
        // tag:因为重名了所以暂时加个索引,这个问题需要处理
        this.audioTracks[trackName] = new window.Audio(src)
    }

    // 修改指定音频轨道对应的音频资源
    setAudioSrc(trackName: string, src: string) {
        if (this.audioTracks.hasOwnProperty(trackName)) {
            this.audioTracks[trackName].src = src
        }
    }

    // 修改指定音频轨道对应的音频音量
    setAudioVolume(trackName: string, volume: number) {
        if (this.audioTracks.hasOwnProperty(trackName)) {
            this.audioTracks[trackName].volume = volume
        }
    }

    // 全局静音
    globalMute() {
        this.globalMuted = true
        ObjectUtils.forEach(this.audioTracks)(e => e[1].muted = true)
    }

    // 取消全局静音
    globalUnmute() {
        this.globalMuted = false
        ObjectUtils.forEach(this.audioTracks)(e => e[1].muted = false)
    }
}

// tag:因为重名了所以暂时加个零，这个问题应该需要解决
const AudioManager0 = new AudioManager()

const Audio: Component<{ name: string, src: string, bindValue: string }> =
    ({ name, src, bindValue }) => {
        AudioManager0.createAudioTrack(name, src)
        createEffect(() => AudioManager0.setAudioVolume(name, VariableMap[bindValue]() as number))
        return <></>
    }


const Element: Component<Dictionary> = (props) => {
    const [local, attributes] = splitProps(props, ["children"])
    return <div {...attributes}>{local.children}</div>
}

const Effector: Component<Dictionary> = (props) => {
    //do something
    return <Element {...props}></Element>
}