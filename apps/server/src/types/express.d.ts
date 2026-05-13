import { Session, User } from "better-auth";

declare global {
	// biome-ignore lint/style/noNamespace: Express augmentation requires namespace
	namespace Express {
		interface Request {
			auth?: {
				getSession: () => Promise<{
					session: Session;
					user: User & { role: string };
				} | null>;
			};
		}
	}
}
