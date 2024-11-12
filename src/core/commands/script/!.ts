export const Continue = () => () => ({ continue: true })

export const Jump =
    () =>
    ({ target }: { target: number }) => ({ jump: target, continue: true })

export const End = () => () => ({ end: true })

// const sign = (context) => ({ name }) => jumpMap[name] = index
