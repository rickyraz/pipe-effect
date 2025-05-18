// deno-lint-ignore-file
import { pipe } from "effect/Function";
import { Effect, Context } from "effect";

// 1. Definisikan interface service dan Tag-nya

// Random service: menyediakan operasi `.next` yang menghasilkan angka acak
// interface RandomService {
// 	readonly _tag: unique symbol;
// 	readonly next: Effect.Effect<number, never, never>;
// }
// const RandomTag = Context.Tag<RandomService>("RandomService");
class Random extends Context.Tag("MyRandomService")<
	Random,
	{ readonly next: Effect.Effect<number> }
>() {}

// Logger service: menyediakan operasi `.log` untuk mencatat pesan
// interface LoggerService {
// 	readonly _tag: unique symbol;
// 	readonly log: (msg: string) => Effect.Effect<void, never, never>;
// }
// const LoggerTag = Context.Tag<LoggerService>("LoggerService");
class Logger extends Context.Tag("MyLoggerService")<
	Random,
	// { readonly next: Effect.Effect<void> }
	{ readonly log: (msg: string) => Effect.Effect<void> }
>() {}

// 2. Program yang membutuhkan kedua service
const program = Effect.gen(function* (_) {
	// ambil masing-masing service dari Context
	yield* Logger;
	const random = yield* Random;
	// const logger = yield* Logger;

	// panggil random.next
	const n = yield* _(random.next);
	// yield* logger.log(`Random#: ${n.toFixed(4)}`); // log hasil

	// log hasilnya
	// yield* _(logger.log(`Generated random number: ${n.toFixed(4)}`));

	// kembalikan keputusan berdasarkan angka
	return n > 0.5
		? `👍 Accepted: ${n.toFixed(4)}`
		: `👎 Rejected: ${n.toFixed(4)}`;
});

// 3a. Sediakan implementasi kedua service secara berantai dengan `provideService`
const runnable1 = pipe(
	program,
	Effect.provideService(Random, {
		next: Effect.sync(() => Math.random()),
	}),
	Effect.provideService(Logger, {
		//anonymous arrow-function yang inline
		log: (msg) => Effect.sync(() => console.log(`[LOG] ${msg}`)),
	}),
);

// 3b. Atau: gabungkan semua layanan ke dalam satu Context dan `provide` sekaligus
const fullContext = pipe(
	Context.empty(),
	Context.add(Random, { next: Effect.sync(() => Math.random()) }),
	Context.add(Logger, {
		//anonymous arrow-function yang inline
		log: (msg) => Effect.sync(() => console.log(`[LOG] ${msg}`)),
	}),
);
const runnable2 = pipe(program, Effect.provide(fullContext));

Effect.runPromise(runnable1).then((res) => console.log("Result:", res));
Effect.runPromise(runnable2).then((res) => console.log("Result2:", res));
