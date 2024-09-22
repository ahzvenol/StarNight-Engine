declare module 'ini-parser' {
    function parse(ini: string): Record<string, any>
    export { parse }
}
