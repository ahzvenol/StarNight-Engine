export const play = (audio: HTMLAudioElement) => (src: string) => {
    audio.src = src
    audio.play()
}
