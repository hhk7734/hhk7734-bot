import { Probot } from "probot";

export function route(app: Probot) {
	app.onAny(async (context) => {
		const repository =
			"repository" in context.payload ? context.payload.repository?.name : null;
		const category = context.name;
		const action = "action" in context.payload ? context.payload.action : null;

		app.log.info({
			repository,
			category,
			action,
		});
	});
}
