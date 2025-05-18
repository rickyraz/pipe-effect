import { pipe, Effect } from "effect";

const getUserById = (
	id: number,
): Effect.Effect<{ id: number; name: string }, Error, never> => {
	if (id === 1) {
		return Effect.succeed({ id: 1, name: "Inosuke Hasibira" });
	}
	return Effect.fail(new Error("user Tidak Ditemukan"));
};

const getPostByUserId = (
	userId: number,
): Effect.Effect<string[], Error, never> => {
	if (userId) {
		return Effect.succeed([
			"Post 1 : Makan Tempura",
			"Post 2 : Melatih pernapasan Buah",
		]);
	}
	return Effect.fail(new Error("Post Tidak ditemukan"));
};

const program = pipe(
	Effect.succeed(1),
	Effect.flatMap((userId) => getUserById(userId)),
	Effect.flatMap((user) => {
		console.log("user telah ditemukan");
		return getPostByUserId(user.id);
	}),
);

Effect.runPromise(program)
	.then((posts) => console.log("Postingan:", posts))
	.catch((error) => console.error("Oops, ada error:", error.message));
// Output:
// User ditemukan: Inosuke Hashibira
// Postingan: [ 'Post 1: Makan tempura!', 'Post 2: Latihan pernapasan buas!' ]
