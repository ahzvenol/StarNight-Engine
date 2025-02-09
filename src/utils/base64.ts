export const jsonToBase64 = (str: string) => window.btoa(unescape(encodeURIComponent(str)))

export const base64ToJson = (base64: string) => decodeURIComponent(escape(window.atob(base64)))
