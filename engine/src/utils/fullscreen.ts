export async function requestFullscreen(element = document.documentElement): Promise<void> {
    if (element.requestFullscreen) {
        return element.requestFullscreen()
    // @ts-expect-error 属性“webkitRequestFullscreen”在类型“Element”上不存在。
    } else if (element.webkitRequestFullscreen) { // Safari
    // @ts-expect-error 属性“webkitRequestFullscreen”在类型“Element”上不存在。
        return element.webkitRequestFullscreen()
    // @ts-expect-error 属性“mozRequestFullScreen”在类型“Element”上不存在。
    } else if (element.mozRequestFullScreen) { // Firefox
    // @ts-expect-error 属性“mozRequestFullScreen”在类型“Element”上不存在。
        return element.mozRequestFullScreen()
    // @ts-expect-error 属性“msRequestFullscreen”在类型“Element”上不存在。
    } else if (element.msRequestFullscreen) { // IE/Edge
    // @ts-expect-error 属性“msRequestFullscreen”在类型“Element”上不存在。
        return element.msRequestFullscreen()
    }
}

export async function exitFullscreen(): Promise<void> {
    if (document.fullscreenElement && document.exitFullscreen) {
        return document.exitFullscreen()
    // @ts-expect-error 属性“webkitExitFullscreen”在类型“Document”上不存在。
    } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
    // @ts-expect-error 属性“webkitExitFullscreen”在类型“Document”上不存在。
        return document.webkitExitFullscreen()
    // @ts-expect-error 属性“mozCancelFullScreen”在类型“Document”上不存在。
    } else if (document.mozFullScreenElement && document.mozCancelFullScreen) {
    // @ts-expect-error 属性“mozCancelFullScreen”在类型“Document”上不存在。
        return document.mozCancelFullScreen()
    // @ts-expect-error 属性“msExitFullscreen”在类型“Document”上不存在。
    } else if (document.msFullscreenElement && document.msExitFullscreen) {
    // @ts-expect-error 属性“msExitFullscreen”在类型“Document”上不存在。
        return document.msExitFullscreen()
    }
}
