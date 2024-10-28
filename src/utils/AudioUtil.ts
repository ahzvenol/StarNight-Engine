export const play = (audio: HTMLAudioElement) => (src: string) => {
    audio.src = src
    audio.play()
}

export const clone = (audio: HTMLAudioElement) => {
    const audioClone = audio.cloneNode()
    audioClone.volume = audio.volume
    return audioClone
}
