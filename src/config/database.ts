import { logger } from "./logger";
import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient({
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "event",
			level: "error",
		},
		{
			emit: "event",
			level: "info",
		},
		{
			emit: "event",
			level: "warn",
		},
	],
});
/* istanbul ignore next */
prismaClient.$on("error", (e) => {
	logger.error(e);
});
/* istanbul ignore next */
prismaClient.$on("warn", (e) => {
	logger.warn(e);
});

prismaClient.$on("info", (e) => {
	logger.info(e);
});

prismaClient.$on("query", (e) => {
	logger.info("Query: " + e.query);
	logger.info("Params: " + e.params);
	logger.info("Duration: " + e.duration + " ms");
});
