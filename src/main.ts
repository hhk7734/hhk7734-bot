import { Server, ProbotOctokit, Probot } from "probot";
import { readEnvOptions } from "probot/lib/bin/read-env-options";
import { getLog } from "probot/lib/helpers/get-log";
import { route } from "./app";
import { config } from "dotenv";

async function startServer(appFn: (app: Probot) => void) {
	config();
	const envOptions = readEnvOptions();

	const {
		// log options
		logLevel: level,
		logFormat,
		logLevelInString,
		logMessageKey,
		sentryDsn,
		// server options
		host,
		port,
		webhookPath,
		webhookProxy,
		// probot options
		appId,
		privateKey,
		redisConfig,
		secret,
		baseUrl,
	} = { ...envOptions };

	const githubToken = process.env.GITHUB_TOKEN;

	if (!githubToken && (!appId || !privateKey)) {
		throw new Error("either `GITHUB_TOKEN` or (`APP_ID` and `PRIVATE_KEY[_PATH]`) are required");
	}

	const logOptions = {
		level,
		logFormat,
		logLevelInString,
		logMessageKey,
		sentryDsn,
	};

	const log = getLog(logOptions);

	const probotOptions = {
		githubToken,
		appId,
		privateKey,
		redisConfig,
		secret,
		baseUrl,
		log: log.child({ name: "probot" }),
	};
	const serverOptions = {
		host,
		port,
		webhookPath,
		webhookProxy,
		log: log.child({ name: "server" }),
		Probot: Probot.defaults(probotOptions),
	};

	const server = new Server(serverOptions);
	await server.load(appFn);
	await server.start();
	return server;
}

startServer(route);
