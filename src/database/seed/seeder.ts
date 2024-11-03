import { usersSeeder } from "./usersSeeder";
import { logger } from "../../config/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tableNames = ["users"];

async function seeder() {
	try {
		await prisma.user.deleteMany();
		for (const tableName of tableNames) {
			await prisma.$queryRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");
			await prisma.$queryRawUnsafe(`TRUNCATE TABLE ${tableName};`);
			await prisma.$queryRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
		}
		await prisma.user.createMany({
			data: usersSeeder,
		});
		const usr = await prisma.user.count();
		logger.info(`There are  ${usr} user in the database.`);
		await prisma.$disconnect();
		process.exit(0);
	} catch (error) {
		logger.error(error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

seeder();
