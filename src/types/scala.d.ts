/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'scalajs:main.js' {
    export function compile(define: string, target: string): (rowIndex: number) => Array<Record<string, any>>
}
