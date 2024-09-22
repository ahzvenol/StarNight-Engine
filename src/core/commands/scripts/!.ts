const toContinue = () => () => ({ continue: true })

export const Continue = { run: toContinue }

const jump =
    () =>
    ({ target }: { target: number }) => ({ jump: target, continue: true })

export const Jump = { run: jump }

const end = () => () => ({ end: true })

export const End = { run: end }

// const sign = (context) => ({ name }) => jumpMap[name] = index
