/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export function pipe<A, B>(a: A, fab: (arg: A) => B): B
export function pipe<A, B, C>(a: A, fab: (arg: A) => B, fbc: (arg: B) => C): C
export function pipe<A, B, C, D>(a: A, fab: (arg: A) => B, fbc: (arg: B) => C, fcd: (arg: C) => D): D
export function pipe<A, B, C, D, E>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E
): E
export function pipe<A, B, C, D, E, F>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F
): F
export function pipe<A, B, C, D, E, F, G>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G
): G
export function pipe<A, B, C, D, E, F, G, H>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I
): I
export function pipe<A, B, C, D, E, F, G, H, I, J>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J
): J
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K
): K
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L
): L
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M
): M
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M,
    fmn: (arg: M) => N
): N
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M,
    fmn: (arg: M) => N,
    fno: (arg: N) => O
): O
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M,
    fmn: (arg: M) => N,
    fno: (arg: N) => O,
    fop: (arg: O) => P
): P
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M,
    fmn: (arg: M) => N,
    fno: (arg: N) => O,
    fop: (arg: O) => P,
    fpq: (arg: P) => Q
): Q
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M,
    fmn: (arg: M) => N,
    fno: (arg: N) => O,
    fop: (arg: O) => P,
    fpq: (arg: P) => Q,
    fqr: (arg: Q) => R
): R
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M,
    fmn: (arg: M) => N,
    fno: (arg: N) => O,
    fop: (arg: O) => P,
    fpq: (arg: P) => Q,
    fqr: (arg: Q) => R,
    frs: (arg: R) => S
): S
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
    a: A,
    fab: (arg: A) => B,
    fbc: (arg: B) => C,
    fcd: (arg: C) => D,
    fde: (arg: D) => E,
    fef: (arg: E) => F,
    ffg: (arg: F) => G,
    fgh: (arg: G) => H,
    fhi: (arg: H) => I,
    fij: (arg: I) => J,
    fjk: (arg: J) => K,
    fkl: (arg: K) => L,
    flm: (arg: L) => M,
    fmn: (arg: M) => N,
    fno: (arg: N) => O,
    fop: (arg: O) => P,
    fpq: (arg: P) => Q,
    fqr: (arg: Q) => R,
    frs: (arg: R) => S,
    fst: (arg: S) => T
): T

export function pipe(a: unknown, ...fns: Function[]): unknown {
    return fns.reduce((value, fn) => fn(value), a)
}
