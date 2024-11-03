import { server } from "../app";
import { logger } from "../config/logger";

export class Process {
	public gracefulShutdown(): void {
		logger.info("SIGTERM/SIGINT signal received: closing HTTP server");
		logger.info("Shutting down gracefully...");
		server.stop();
	}
}

// const gracefulShutdown = new Process();
