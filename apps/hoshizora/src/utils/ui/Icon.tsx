import type { Component } from 'solid-js'

export const MusicIcon = () => (
    <svg width="24px" height="18px" viewBox="0 0 49.24 84" fill="#344460">
        <path
            d="M27.8,0c0,6.42,3,11.78,7.64,16.54,2.57,2.62,5.23,5.19,7.73,7.87a21.25,21.25,0,0,1,5.71,10.36,22.14,22.14,0,0,1-.75,10.74,55.38,55.38,0,0,1-6.5,13.61c-.14.22-.55.31-.83.46l-.1-.16c.81-1.45,1.71-2.88,2.43-4.37A29.29,29.29,0,0,0,46.37,39.4c-.75-8.19-5.74-14.14-14.79-17-1.21-.38-2.44-.66-3.77-1v.94c0,14.14-.06,28.28.05,42.41a11.47,11.47,0,0,1-4.36,9.16A21.81,21.81,0,0,1,8.82,79.37,13.24,13.24,0,0,1,5.63,79C1.2,77.86-.91,74.52.37,70.63a14.09,14.09,0,0,1,5.92-7.16,21.16,21.16,0,0,1,13.37-3.9,36,36,0,0,1,4.49.83,2.23,2.23,0,0,0,0-.4V.4c0-.14,0-.27,0-.4Z"
            stroke="#344460"
            stroke-width="6"
        />
    </svg>
)

export const BackIcon = () => (
    <svg width="24px" height="18px" viewBox="0 0 48 48" fill="none">
        <path
            d="M12.9998 8L6 14L12.9998 21"
            stroke="#344460"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M6 14H28.9938C35.8768 14 41.7221 19.6204 41.9904 26.5C42.2739 33.7696 36.2671 40 28.9938 40H11.9984"
            stroke="#344460"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
)

export const PlayIcon: Component<{ width: string, height: string }> = ({ width, height }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="butt"
        stroke-linejoin="miter"
    >
        <path
            d="M17.533 10.974a1 1 0 0 0-1.537.844v24.356a1 1 0 0 0 1.537.844L36.67 24.84a1 1 0 0 0 0-1.688L17.533 10.974Z"
            fill="currentColor"
            stroke="none"
        />
    </svg>
)

export const PauseIcon: Component<{ width: string, height: string }> = ({ width, height }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="butt"
        stroke-linejoin="miter"
    >
        <path d="M14 12h4v24h-4zM30 12h4v24h-4z" />
        <path fill="currentColor" stroke="none" d="M14 12h4v24h-4zM30 12h4v24h-4z" />
    </svg>
)

export const StopIcon: Component<{ width: string, height: string }> = ({ width, height }) => (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none">
        <path
            d="M34 12H14C12.8954 12 12 12.8954 12 14V34C12 35.1046 12.8954 36 14 36H34C35.1046 36 36 35.1046 36 34V14C36 12.8954 35.1046 12 34 12Z"
            fill="#000000"
        />
    </svg>
)

export const SoundIcon: Component<{ width: string, height: string }> = ({ width, height }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="butt"
        stroke-linejoin="miter"
    >
        <path d="m14 16 10-9v34l-10-9H6V16h8Z" />
        <path d="M31.071 16.929c3.905 3.905 3.905 10.237 0 14.142M36.727 11.272c7.03 7.03 7.03 18.426 0 25.456" />
    </svg>
)
