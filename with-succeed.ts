import { Effect, pipe } from "effect";
const program = pipe(
	Effect.succeed(10),
	Effect.map((n) => n + 5),
);

Effect.runPromise(program).then((n) => console.log(n));
