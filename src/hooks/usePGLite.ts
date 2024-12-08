import { PGlite } from "@electric-sql/pglite";

export const usePGLite = (): {
	db: PGlite;
	query: (
		querystr: string,
	) => Promise<{ duration: number; records: { [key: string]: any }[]; error?: unknown; schema: Record<string, any> }>;
	ready: () => Promise<void>;
} => {
	const db = new PGlite("idb://quackbook");
	const query = async (querystr: string) => {
		await db.waitReady;
		const start = performance.now();
		let records = null;
		[records] = await db.exec(querystr);
		const duration = performance.now() - start;
		return { duration, records: records ? records.rows : [], schema: {} };
	};
	const ready = async () => await db.waitReady;
	return { db, query, ready };
};
