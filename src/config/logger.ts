import "dotenv/config";
import pino, { LogFn } from "pino";

const logLevel: string = process.env.LOG_LEVEL ?? "prod";
const timestamp: string = new Date().toISOString();
const logFolder: string = `./logs/${timestamp.slice(0, 10).replace(/-/g, "")}/${timestamp.slice(0, 10)}`;

const customLevel = {
	query: 25, // Any number between debug (20) and info (30) will work the same
	notice: 35, // Any number between info (30) and warn (40) will work the same
};

const pinoOption = {
	formatters: {
		bindings: (bindings: pino.Bindings) => {
			return {
				pid: bindings.pid,
			};
		},
		level: (label: string, number: number) => {
			return { severity: label.toUpperCase(), level: number };
		},
	},
	timestamp: () => {
		return `,"timestamp":"${new Date(Date.now()).toISOString()}"`;
	},
	hooks: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		logMethod(inputArgs: any, method: LogFn) {
			try {
				if (inputArgs[0].timestamp) {
					delete inputArgs[0].timestamp;
				}
				if (inputArgs[0].message) {
					inputArgs[0].msg = `${inputArgs[0].message}-${inputArgs[0].target}`;
					delete inputArgs[0].message;
					delete inputArgs[0].target;
				}
				if (inputArgs[0].error) {
					inputArgs[0].error = inputArgs[0].error.split("\n")[0];
				}
				if (inputArgs[0].trace) {
					inputArgs[0].trace = inputArgs[0].trace.split("\n")[0];
				}
				if (inputArgs[0].stack) {
					inputArgs[0].stack = inputArgs[0].stack.split("\n")[0];
				}
			} catch (error) {
				logger.error(error);
			}
			return method.apply(this, inputArgs);
		},
	},
	redact: {
		paths: ["host", "payload.password", "header.authorization"],
		censor: "***",
		remove: false,
	},
	customLevels: customLevel,
};

const transport = pino.transport({
	targets: [
		{
			level: logLevel,
			target: "pino/file",
			options: {
				destination: 1,
				colorize: true,
			}, // this writes to STDOUT
		},
		{
			level: logLevel,
			target: "pino/file",
			options: {
				destination: `${logFolder}-${logLevel}.log`,
				mkdir: true,
			},
		},
	],
});

export const logger = pino(pinoOption, transport);

export const pinoLog = pino({ level: process.env.LOG_LEVEL ?? "debug" });
