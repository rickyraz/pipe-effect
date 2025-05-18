import { Effect, Console, pipe } from "effect";

const getUserScore = (id: number): Effect.Effect<number, Error, never> => {
	if (id === 1) return Effect.succeed(85); // Nezuko
	if (id === 2) return Effect.succeed(45); // Iblis lemah
	return Effect.fail(new Error("User tidak ditemukan"));
};

const checkIfQualified = (score: number) => score >= 70;

// Pakai filterOrFail
const programFilter = (id: number) =>
	pipe(
		getUserScore(id),
		Effect.filterOrFail(
			checkIfQualified, // Hanya skor >= 70 yang lolos
			(score) => new Error(`Skor ${score} tidak memenuhi syarat (minimal 70).`), // Error kalau gagal filter
		),
		Effect.map((score) => `Selamat! Skor ${score} memenuhi syarat!`),
		Effect.tap(Console.log),
		Effect.catchAll((error) => Console.error(`Gagal filter: ${error.message}`)),
	);

Effect.runPromise(programFilter(1)); // Lolos
Effect.runPromise(programFilter(2)); // Gagal filter
// Output untuk ID 1: Selamat! Skor 85 memenuhi syarat!
// Output untuk ID 2: Gagal filter: Skor 45 tidak memenuhi syarat (minimal 70).
