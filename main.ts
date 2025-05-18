import { Effect, pipe, Console } from "effect";

const initializeValue = 10;

const addFive = (v: number) => v + 5;
const multiplyByTwo = (v: number) => v * 2;
const toStringValue = (v: number) => String(v);

const a = pipe(initializeValue, addFive, multiplyByTwo, toStringValue);

console.log(a);

const b = pipe(
	Effect.succeed(2),
	Effect.map((n) => n * 3), // 6
	Effect.map((n) => n + 4), // 10
	Effect.tap((res) => Console.log(`res ${res}`)), // log “10”
);
const c = pipe(
	9,
	(n) => n * 3, // 6
	(n) => n + 4, // 10
	(res) => Console.log(`res ${res}`), // log “10”
);
const d = pipe(
	Effect.succeed(3),
	Effect.map((n) => n * 3), // 6
	Effect.map((n) => n + 4), // 10
	Effect.tap((res) => Console.log(`res ${res}`)), // log “10”
);

// Jalankan dengan runPromise (atau runSync untuk efek sinkron)
Effect.runPromise(b);
Effect.runPromise(c);
// atau
Effect.runSync(d);

// console.log(Effect.runSyncExit(e));
