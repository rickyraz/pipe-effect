import { pipe } from "effect/Function";
import { Effect, Console, Duration } from "effect";

const fetchData = (label: string, delayMs: number) =>
	pipe(
		Effect.succeed(`Data ${label}`),
		Effect.delay(Duration.millis(delayMs)),
		Effect.tap(() => Console.log(`${label} selesai diproses.`)),
	);

const effectsToRun = [
	fetchData("A", 40), // Paling lama
	fetchData("B", 50),
	fetchData("C", 100),
	fetchData("D", 150),
	fetchData("E", 70),
];
const effectsToRun2 = [
	fetchData("Z", 40), // Paling lama
	fetchData("X", 50),
	fetchData("V", 100),
	fetchData("N", 150),
	fetchData("M", 70),
];

// Menjalankan semua Effect dengan batasan 2 yang berjalan bersamaan
const concurrentProgram = pipe(
	Effect.all(effectsToRun, { concurrency: 2 }), // <--- INI DIA KUNCINYA!
	Effect.map(
		(results) => `Hasil gabungan (Concurrency 2): ${results.join(" | ")}`,
	),
	Effect.tap(Console.log),
);

Effect.runPromise(concurrentProgram)
	.then(() => Console.log("--- Program Konkuren Selesai ---"))
	.catch((e) => Console.error("Oops, ada yang salah:", e));

// Sebagai perbandingan, tanpa batasan concurrency (defaultnya "inherit" atau unbounded)
const unboundedProgram = pipe(
	Effect.all(effectsToRun2, { concurrency: "unbounded" }), // Tidak ada opsi concurrency, atau bisa { concurrency: "inherit" }
	Effect.map((results) => `Hasil gabungan (Unbounded): ${results.join(" - ")}`),
	Effect.tap(Console.log),
);

Effect.runPromise(unboundedProgram)
	.then(() => Console.log("--- Program Unbounded Selesai ---"))
	.catch((e) => Console.error("Oops, ada yang salah (unbounded):", e));
