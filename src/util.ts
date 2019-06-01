export function avg(a: number, b: number) {
    return (a + b) / 2;
}

export function randomNum(from: number, to: number) {
    return from + Math.random() * (to - from);
}

export function randomInt(from: number, to: number) {
    return Math.floor(randomNum(from, to + 1));
}
