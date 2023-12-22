import { Context } from 'probot';
import P from 'pino';

export async function executeCommandIfExists(
	context: Context<'issue_comment.created'>,
	logger: P.Logger,
) {
	const repoName = context.payload.repository.name;
	const repoOwner = context.payload.repository.owner.login;
	const prURL = context.payload.issue.html_url;
	const comment = context.payload.comment.body;
	const commentUser = context.payload.comment.user.login;

	const commands = comment
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.startsWith('/'))
		.map((line) => line.split(' '));

	if (commands.length === 0) {
		return;
	}

	logger.info(
		{
			pull_request_url: prURL,
			user: commentUser,
			commands: commands,
		},
		'commands received',
	);

	const collaboratorPermissionLevel = await context.octokit.repos.getCollaboratorPermissionLevel({
		owner: repoOwner,
		repo: repoName,
		username: commentUser,
	});

	const commentUserRole = collaboratorPermissionLevel.data.role_name;

	if (!['admin', 'maintain', 'write'].includes(commentUserRole)) {
		const comment = context.issue({
			body: `commands are only available to people with Admin || Maintainer || Write role on ${repoName}.`,
		});
		const res = await context.octokit.issues.createComment(comment);
		if (res.status !== 201) {
			logger.error({ status: res.status, response: res.data }, 'failed to create comment');
		}
		return;
	}

	for (const c of commands) {
		const command = c[0];
		const args = c.slice(1);

		switch (command) {
			default:
				logger.info({ command, args }, 'unknown command');
				break;
		}
	}
}
