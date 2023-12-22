module.exports = {
	root: true,
	extends: ["eslint:recommended", "prettier", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	env: {
		browser: true,
		es2021: true,
	},
};
