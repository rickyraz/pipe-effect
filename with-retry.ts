// deno-lint-ignore-file
import { Effect, Console, Schedule, Duration, pipe } from "effect";

let attempt = 0;
// operasi lembek / acak kadut
const flakyOperation = Effect.suspend(() => {
	attempt++;
	if (attempt < 3) {
		return Effect.fail(new Error(`Gagal di percobaan ke-${attempt}`));
	}
	return Effect.succeed(`Sukses di percobaan ke-${attempt}! Yeay!`);
});

// Coba ulang dengan jadwal tertentu (misalnya, 3 kali, jeda 100ms)
const resilientProgram = pipe(
	flakyOperation,
	Effect.retry(Schedule.recurs(2).pipe(Schedule.addDelay(() => "100 millis"))), // Coba lagi 2x setelah gagal pertama
	Effect.tap(Console.log),
	Effect.catchAll((error) =>
		Console.error(`Gagal permanen setelah retry: ${error.message}`),
	),
);

// Ulangi Effect yang sukses
let count = 0;
const repeatingTask = pipe(
	Effect.sync(() => {
		count++;
		return `Tugas diulang ke-${count}`;
	}),
	Effect.tap(Console.log),
	Effect.repeat(Schedule.recurs(2)), // Ulangi 2x setelah sukses pertama (total 3x jalan)
);

Effect.runPromise(resilientProgram);
// Output resilientProgram (kurang lebih):
// (setelah beberapa pesan error dari percobaan gagal)
// Sukses di percobaan ke-3! Yeay!

Effect.runPromise(repeatingTask);
// Output repeatingTask:
// Tugas diulang ke-1
// Tugas diulang ke-2
// Tugas diulang ke-3
