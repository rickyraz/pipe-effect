import { Effect, Console, pipe } from "effect";

const program = pipe(
	Effect.succeed({ item: "Pedang Nichirin", quantity: 2 }),
	Effect.tap((inventory) =>
		Console.log(
			`Mengintip isi tas: ${inventory.item} ada ${inventory.quantity}`,
		),
	), // Cuma ngintip, gak ngubah apa-apa
	Effect.map((inventory) => ({
		...inventory,
		message: `Siap bertarung dengan ${inventory.quantity} ${inventory.item}!`,
	})),
	Effect.tap((final) => Console.log(`Status akhir: ${final.message}`)),
);

Effect.runPromise(program);
// Output:
// Mengintip isi tas: Pedang Nichirin ada 2
// Status akhir: Siap bertarung dengan 2 Pedang Nichirin!
