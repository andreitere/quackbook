import { PGlite } from "@electric-sql/pglite";

export function usePGLite() {
	const db = new PGlite("idb://quackbook");
	console.log(db);
	const query = async (querystr: string) => {
		console.log(db.ready);
		await db.waitReady;
		const start = performance.now();
		let records = null;
		let error = null;
		try {
			[records] = await db.exec(querystr);
			console.log(records);
		} catch (e) {
			error = e;
			console.log(e);
		}

		const duration = performance.now() - start;
		return { duration, records: records.rows, error, schema: {} };
	};
	const ready = async () => await db.waitReady;
	return { db, query, ready };
}
