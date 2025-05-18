// deno-lint-ignore-file
import { Effect, Console, Schedule, Duration, pipe } from "effect";

// const fetchApi = Effect.tryPromise({
// 	try: () => fetch("https://httpstat.us/503?sleep=100"),
// 	catch: (e) => new Error(`Request error: ${e}`),
// }).pipe(
// 	Effect.flatMap((res) => {
// 		if (!res.ok) {
// 			return Effect.fail(new Error(`API gagal dengan status ${res.status}`));
// 		}

// 		// Bungkus fetch().text() dalam Effect.tryPromise agar tetap Effect
// 		return Effect.tryPromise({
// 			try: () => res.text(),
// 			catch: (e) => new Error(`Gagal baca response: ${e}`),
// 		});
// 	}),
// );

const fetchApi = pipe(
	Effect.sync(() => console.log("➡️  Memulai request ke API...")),
	Effect.flatMap(() =>
		Effect.tryPromise({
			try: () => fetch("https://httpstat.us/503?sleep=100"),
			catch: (e) => new Error(`Request error: ${e}`),
		}),
	),
	Effect.tap(() => Console.log("✅ Request selesai")),
	Effect.flatMap((res) => {
		if (!res.ok) {
			return Effect.fail(new Error(`API gagal dengan status ${res.status}`));
		}
		return Effect.tryPromise({
			try: () => res.text(),
			catch: (e) => new Error(`Gagal baca response: ${e}`),
		});
	}),
);

// Retry dengan delay progresif
const resilientApiCall = pipe(
	fetchApi,
	Effect.retry(
		Schedule.recurs(3).pipe(
			// total 4x percobaan (1 awal + 3 retry)
			Schedule.addDelay((_) => Duration.millis(500)), // delay 500ms per retry
			Schedule.tapOutput((attempt) =>
				Console.log(`🔁 Retry attempt ke-${attempt + 1}`),
			),
		),
	),
	Effect.catchAll((error) =>
		Console.error(`Gagal permanen setelah retry API: ${error.message}`),
	),
);

Effect.runPromise(resilientApiCall);
