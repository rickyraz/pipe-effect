import { pipe } from "effect/Function";
import { Effect, Duration, Console } from "effect";

// Simulasi resource
type DbConn = { id: number };
let counter = 1;

// 1. Acquire: buka koneksi → menghasilkan DbConn
const acquireConn = Effect.sync<DbConn>(() => {
	const conn = { id: counter++ };
	console.log(`[acquire] opened conn#${conn.id}`);
	return conn;
});

// 2. Release: tutup koneksi → void
const releaseConn = (conn: DbConn) =>
	Effect.sync<void>(() => {
		console.log(`[release] closed conn#${conn.id}`);
	});

// 3. Gunakan koneksi, misal jalankan “query” → string hasil
const useConn = (conn: DbConn) =>
	pipe(
		Effect.sync<string>(() => {
			console.log(`[use] running query on conn#${conn.id}`);
			return `result-from-${conn.id}`;
		}),
		Effect.delay(Duration.millis(100)),
	);

// 4. Rangkai acquire & release
const bracketed = pipe(
	Effect.acquireRelease(acquireConn, releaseConn),
	Effect.flatMap((conn) => useConn(conn)),
	Effect.tap((res) => Console.log(`[program] got: ${res}`)),
);

// 5. Bungkus dengan scoped → otomatis cleanup
const program = Effect.scoped(bracketed);

// 6. Jalankan
await Effect.runPromise(program);

/* Output:
[acquire] opened conn#1
[use]     running query on conn#1
[program] got: result-from-1
[release] closed conn#1
*/

// Effect.sync<T>(() => ...) hanya membutuhkan 1 generic T, yaitu tipe return thunk.
// acquireRelease membentuk “bracket” pattern: acquire → use → release.
// Effect.scoped(...) menjamin release selalu dipanggil, walau terjadi error atau interrupt.
// Baru runPromise (atau runner lain) yang mengeksekusi seluruh efek.
