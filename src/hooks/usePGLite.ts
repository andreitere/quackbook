import { PGlite } from "@electric-sql/pglite"

export const usePGLite = (): {
  db: PGlite
  query: (querystr: string) => Promise<{ duration: number; records: { [key: string]: any }[]; error?: unknown; schema: Record<string, any> }>
  ready: () => Promise<void>
} => {
  const db = new PGlite("idb://quackbook")
  const query = async (querystr: string) => {
    await db.waitReady
    const start = performance.now()
    const [records] = await db.exec(querystr)
    console.log("result", records, querystr)
    const duration = performance.now() - start
    return { duration, records: records.rows, schema: records.fields }
  }
  const ready = async () => await db.waitReady
  return { db, query, ready }
}
