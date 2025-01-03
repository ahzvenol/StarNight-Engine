export const _continue = () => ({ continue: true }) as const

export const _jump = (target: number) => ({ jump: target, continue: true }) as const

export const _end = () => ({ end: true }) as const
