// 跨幕环境变量file,需要收集副作用

// 音轨数是提前设置的固定的,如果遇到预期之外的音轨应该报错
// 音轨的音量已经与特定变量绑定,如果要实现缓动效果duration,transition需要考虑实现方式
const set =
    (context) =>
    ({ target, file }) => {}

export { set }
