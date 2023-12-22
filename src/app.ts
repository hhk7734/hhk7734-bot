import { Probot } from "probot";
import { executeCommandIfExists } from "./command";

export function route(app: Probot) {
	app.onAny(async (context) => {
		const repository = "repository" in context.payload ? context.payload.repository?.name : null;
		const category = context.name;
		const action = "action" in context.payload ? context.payload.action : null;

		app.log.info({
			repository,
			category,
			action,
		});
	});

	app.on("issue_comment.created", async (context) => {
		if (context.payload.issue.pull_request) {
			executeCommandIfExists(context, app.log.child({ name: "command" }));
		}
	});
}
