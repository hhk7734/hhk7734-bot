import { Probot } from "probot";

export function app(bot: Probot) {
	bot.on("issues.opened", async (context) => {
		bot.log.info(`issue opened: ${context.payload.issue.title}`);
	});
}
