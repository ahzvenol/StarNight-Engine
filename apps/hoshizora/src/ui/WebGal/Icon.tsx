import type { Component } from 'solid-js'

export const Save: Component<{ fill: string }> = (props) => (
    <svg stroke={props.fill} width="1.2em" height="1.2em" viewBox="0 0 48 48" fill="none">
        <path
            d="M6 9C6 7.34315 7.34315 6 9 6H34.2814L42 13.2065V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9Z"
            fill="none"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.0083 6L24 13.3846C24 13.7245 23.5523 14 23 14H15C14.4477 14 14 13.7245 14 13.3846L14 6"
            fill="none"
        />
        <path
            d="M24.0083 6L24 13.3846C24 13.7245 23.5523 14 23 14H15C14.4477 14 14 13.7245 14 13.3846L14 6H24.0083Z"
            stroke="rgba(123,144,169,1)"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M9 6H34.2814"
            stroke="rgba(123,144,169,1)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M14 26H34"
            stroke="rgba(123,144,169,1)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path d="M14 34H24.0083" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
)

export const FolderOpen: Component<{ fill: string }> = (props) => (
    <svg stroke={props.fill} width="1.2em" height="1.2em" viewBox="0 0 48 48" fill="none">
        <path
            d="M4 9V41L9 21H39.5V15C39.5 13.8954 38.6046 13 37.5 13H24L19 7H6C4.89543 7 4 7.89543 4 9Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M40 41L44 21H8.8125L4 41H40Z"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
)

export const Home: Component<{ fill: string }> = (props) => (
    <svg stroke={props.fill} width="1.2em" height="1.2em" viewBox="0 0 48 48" fill="none">
        <path
            d="M9 18V42H39V18L24 6L9 18Z"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path d="M19 29V42H29V29H19Z" fill="none" stroke-width="2" stroke-linejoin="round" />
        <path d="M9 42H39" stroke-width="2" stroke-linecap="round" />
    </svg>
)

export const Setting: Component<{ fill: string }> = (props) => (
    <svg stroke={props.fill} width="1.2em" height="1.2em" viewBox="0 0 48 48" fill="none">
        <path
            d="M18.2838 43.1713C14.9327 42.1736 11.9498 40.3213 9.58787 37.867C10.469 36.8227 11 35.4734 11 34.0001C11 30.6864 8.31371 28.0001 5 28.0001C4.79955 28.0001 4.60139 28.01 4.40599 28.0292C4.13979 26.7277 4 25.3803 4 24.0001C4 21.9095 4.32077 19.8938 4.91579 17.9995C4.94381 17.9999 4.97188 18.0001 5 18.0001C8.31371 18.0001 11 15.3138 11 12.0001C11 11.0488 10.7786 10.1493 10.3846 9.35011C12.6975 7.1995 15.5205 5.59002 18.6521 4.72314C19.6444 6.66819 21.6667 8.00013 24 8.00013C26.3333 8.00013 28.3556 6.66819 29.3479 4.72314C32.4795 5.59002 35.3025 7.1995 37.6154 9.35011C37.2214 10.1493 37 11.0488 37 12.0001C37 15.3138 39.6863 18.0001 43 18.0001C43.0281 18.0001 43.0562 17.9999 43.0842 17.9995C43.6792 19.8938 44 21.9095 44 24.0001C44 25.3803 43.8602 26.7277 43.594 28.0292C43.3986 28.01 43.2005 28.0001 43 28.0001C39.6863 28.0001 37 30.6864 37 34.0001C37 35.4734 37.531 36.8227 38.4121 37.867C36.0502 40.3213 33.0673 42.1736 29.7162 43.1713C28.9428 40.752 26.676 39.0001 24 39.0001C21.324 39.0001 19.0572 40.752 18.2838 43.1713Z"
            fill="none"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M24 31C27.866 31 31 27.866 31 24C31 20.134 27.866 17 24 17C20.134 17 17 20.134 17 24C17 27.866 20.134 31 24 31Z"
            fill="none"
            stroke-width="2"
            stroke-linejoin="round"
        />
    </svg>
)

export const Logout: Component = () => (
    <svg stroke="rgba(123,144,169,1)" width="1.2em" height="1.2em" viewBox="0 0 48 48" fill="none">
        <path d="M23.9917 6H6V42H24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M33 33L42 24L33 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16 23.9917H42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
)

export const CloseSmall: Component = () => (
    <svg width="4em" height="4em" viewBox="0 0 48 48" fill="none">
        <path d="M14 14L34 34" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14 34L34 14" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
)
