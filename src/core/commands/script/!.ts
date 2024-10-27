const toContinue = () => () => ({ continue: true })

export const Continue = toContinue

const jump =
    () =>
    ({ target }: { target: number }) => ({ jump: target, continue: true })

export const Jump = jump

const end = () => () => ({ end: true })

export const End = end

// const sign = (context) => ({ name }) => jumpMap[name] = index
