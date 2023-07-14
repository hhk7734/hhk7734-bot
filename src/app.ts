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

	app.on("issue_comment.created", async (context) => {
		// Commands for Pull Requests
		if (context.payload.issue.pull_request) {
			const repoName = context.payload.repository.name;
			const repoOwner = context.payload.repository.owner.login;
			const comment = context.payload.comment.body;
			const commentUser = context.payload.comment.user.login;

			const commands = comment
				.split(/\r?\n/)
				.map((line) => line.trim())
				.filter((line) => line.startsWith("/"))
				.map((line) => line.split(" "));

			if (commands.length === 0) {
				return;
			}

			const collaboratorPermissionLevel =
				await context.octokit.repos.getCollaboratorPermissionLevel({
					owner: repoOwner,
					repo: repoName,
					username: commentUser,
				});

			const commentUserRole = collaboratorPermissionLevel.data.role_name;

			if (!["admin", "maintain", "write"].includes(commentUserRole)) {
				const comment = context.issue({
					body: `commands are only available to people with Admin || Maintainer || Write role on ${repoName}.`,
				});
				await context.octokit.issues.createComment(comment);
				return;
			}

			for (const c of commands) {
				const command = c[0];
				const args = c.slice(1);

				switch (command) {
				}
			}
		}
	});
}
