import { Effect, Context } from "effect";

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag("MyRandomService")<
	Random,
	{ readonly next: Effect.Effect<number> }
>() {}

// Using the service
const program = Effect.gen(function* () {
	const random = yield* Random;
	const randomNumber = yield* random.next;
	console.log(`random number: ${randomNumber}`);
});

// Providing the implementation
//
//      ┌─── Effect<void, never, never>
//      ▼
const runnable = Effect.provideService(program, Random, {
	next: Effect.sync(() => Math.random()),
});

// Run successfully
Effect.runPromise(runnable);
/*
Example Output:
random number: 0.8241872233134417
*/
