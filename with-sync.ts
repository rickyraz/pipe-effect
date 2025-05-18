import { Effect, pipe } from "effect";

const getPotensialRiskData = (): { data: string } => {
	if (Math.random() < 0.5) {
		throw new Error("Yah Error acak terjadi!");
	}
	return { data: "INI data penting dari operasi asinkron" };
};

const program = pipe(
	Effect.sync(() => getPotensialRiskData()),
	Effect.map((result) => result.data.toUpperCase()),
);

Effect.runPromise(program)
	.then((data) => console.log(data))
	.catch((error) => console.error(error));
