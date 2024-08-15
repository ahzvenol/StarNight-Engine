// 跨幕环境变量file,需要收集副作用

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
const set = (context) => ({ name, file, x, y, z, w, h }) => {

}

// x, y,w, h,duration,transition可选,若不设定则保持原参数
const move = (context) => ({ target, x, y, w, h, duration, transition }) => {

}

//如果图片已经移动到视图外的话,其实清除与否是无所谓的事情了
const clear = (context) => ({ target }) => {

}

export { set, move, clear }