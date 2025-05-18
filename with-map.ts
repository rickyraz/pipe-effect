import { Effect, pipe } from "effect";

const program = pipe(
	Effect.succeed({ name: "Tanjiro", power: 100 }),
	Effect.map((user) => ({
		...user,
		name: user.name.toUpperCase(),
		power: user.power * 3,
	})),
	Effect.map((user) => `User ${user.name} punya power ${user.power}`),
);

Effect.runPromise(program).then((result) => console.log(result));
