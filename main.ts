import { Effect, pipe, Console } from "effect";

const initializeValue = 10;
const addFive = (v: number) => v + 5;
const multiplyByTwo = (v: number) => v * 2;
const toStringValue = (v: number) => String(v);

const a = pipe(initializeValue, addFive, multiplyByTwo, toStringValue);

const b = pipe(
	Effect.succeed(2),
	Effect.map((n) => n * 3),
	Effect.map((n) => n + 4),
	Effect.tap((res) => Console.log(`res ${res}`)),
);
const c = pipe(
	9,
	(n) => n * 3,
	(n) => n + 4,
	(res) => Console.log(`res ${res}`),
);

const initializeValue2 = Effect.succeed(82);
const addOne = Effect.map((n: number) => n * 1);
const multiplyTen = Effect.map((n: number) => n * 10);

const d = pipe(
	initializeValue2,
	addOne,
	multiplyTen,
	Effect.tap((res) => Console.log(`res ${res}`)),
);

console.log(a);
// Jalankan dengan runPromise (atau runSync untuk efek sinkron)
Effect.runPromise(b);
Effect.runPromise(c);
// atau
Effect.runSync(d);
