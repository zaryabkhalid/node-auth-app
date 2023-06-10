export const jsonOptions = {
	inflate: true,
	limit: "1mb",
	reviver: (key, value) =>
		typeof value === "string" ? value.toUpperCase() : value,
	strict: true,
	type: "application/json",
};
