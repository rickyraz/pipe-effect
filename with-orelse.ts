import { pipe, Effect, Console } from "effect";

const potentiallyFailingOperation = (
	id: number,
): Effect.Effect<string, Error, never> => {
	if (id === 1) {
		return Effect.succeed("Data Sukses untuk ID");
	}
	return Effect.fail(new Error(`Gagal untuk mendapatkan ID ${id}`));
};

const programCatchAll = (id: number) =>
	pipe(
		potentiallyFailingOperation(id),
		Effect.catchAll((error) => {
			Console.error(`Error ditangkap ${error}`);
			return Effect.succeed("Dapat data default karena Error.");
		}),
		Effect.tap(Console.log),
	);

const programOrElse = (id: number) =>
	pipe(
		potentiallyFailingOperation(id),
		Effect.orElse(() => {
			// Kalau gagal, coba Effect ini
			Console.log("Operasi utama gagal, mencoba alternatif...");
			return Effect.succeed("Data dari operasi alternatif!");
		}),
		Effect.tap(Console.log),
	);

Effect.runPromise(programCatchAll(1)); // Sukses
Effect.runPromise(programCatchAll(2)); // Gagal, tapi ditangkap
Effect.runPromise(programOrElse(1)); // Sukses
Effect.runPromise(programOrElse(2)); // Gagal, coba alternatif
