import cors from "cors";
import helmet from "helmet";
import pinoHTTP from "pino-http";
import compression from "compression";
import express, { Application, type Request, type Response } from "express";
import { logger } from "../config/logger";

export default class ExpressServer {
	private readonly app: Application;

	constructor() {
		this.app = express();
		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware() {
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(compression());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		// this.app.use(limiter);
		// this.app.use(LogMiddleware.reqInterceptor);
		this.app.use(pinoHTTP({ logger }));
		// this.app.use(ErrorMiddleware.generalError);
		this.app.disable("x-powered-by");
	}

	private setupRoutes() {
		// this.app.use("/v1", publicRouterV1);
		// this.app.use("/", publicRouter);
		this.app.all("*", (req: Request, res: Response) => {
			res.status(404).json({
				error: `${req.baseUrl}${req.url} Not Found`,
			});
		});

		this.app.all("*", (req: Request, res: Response) => {
			res.status(404).json({ error: "URL not found" });
		});
	}

	public getApp(): Application {
		return this.app;
	}
}
