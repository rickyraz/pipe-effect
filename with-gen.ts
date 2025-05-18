import { pipe, Effect, Console } from "effect";

const getUser = Effect.succeed({ id: 1, name: "Zenitsu Agatsuma" });
const getAge = (id: number) => Effect.succeed(id === 1 ? 16 : 0);

// Gen adalah cara menulis sequential effect composition dengan generator functions (function*).
// Ini cara imperatif-like syntax di atas monadic chaining (flatMap).

// Generators lebih dekat ke konsep CoAlgebra / CoProduct (pull-based interaction).
// Async/Await adalah spesifik instansiasi dari Free Monad untuk IO effect.

// >> Tulis efek secara imperative, tapi tetap tipenya aman dan bisa digabung dengan retry, race, dll.
// yield* _(…) di dalam Effect.gen serupa await pada async function,
// tapi kamu tidak mengorbankan keunggulan monadik (error handling, concurrency, dependency injection)

const program = Effect.gen(function* (_) {
	yield* _(Console.log("Mulai mencari data Zenitsu"));
	const user = yield* _(getUser);
	yield* _(Console.log(`Dapat User ${user.name}`));
	const age = yield* _(getAge(user.id));
	yield* _(Console.log(`${user.name} ternyata berumur ${age} tahun!`));
	return `${user.name} (Umur ${age})`;
});

const finalProgram = pipe(
	program,
	Effect.tap((result) => Console.log(`hasil Akhir dari gen adalah ${result}`)),
);

Effect.runPromise(finalProgram).catch((e) => console.error(e));
