import { useSQLBackend } from "@/hooks/useSQLBackend";
import { ref } from "vue";
import { useProjects } from "./project";
import { createSharedComposable } from "@vueuse/core";

// type Column = {
// 	column_name: string;
// 	data_type: string;
// 	is_nullable: boolean;
// 	column_default?: string;
// 	is_identity: boolean;
// };

// type DBTable = {
// 	table: string;
// 	columns: Column[];
// };

// type SchemaTree = {
// 	[database: string]: {
// 		[schema: string]: {
// 			[table: string]: DBTable;
// 		};
// 	};
// };
export type DataModelNode = {
	id: string | number;
	label: string;
	children?: DataModelNode[];
	type: string;
};

export const useDBSchema = createSharedComposable(() => {
	const { backend } = useSQLBackend();
	const { activeProjectMeta } = useProjects();
	const schema = ref<Record<string, any>[]>();

	const updateSchemaDetails = async () => {
		// Step 1: Get all schemas
		let { records } = await backend.value.query(`
			SELECT table_catalog as database, table_schema as schema, table_name as table
			FROM information_schema.tables
			WHERE table_catalog NOT IN ('system')
			AND table_schema NOT IN ('information_schema', 'pg_catalog')
		`);
		console.log(records);
		if (activeProjectMeta.sql.backend === "duckdb_wasm") {
			//@ts-ignore
			records = records.map((t) => t.toJSON());
		}

		// Step 2: For each schema, get all tables and build the tree

		const _schema = await Promise.all(
			records.map(async ({ database, schema, table }: Record<string, any>) => {
				console.log({ database, schema, table });
				let { records: columns } = await backend.value.query(`
					select * from information_schema.columns where table_catalog = '${database}' and table_schema = '${schema}' and table_name = '${table}';
				`);
				if (activeProjectMeta.sql.backend === "duckdb_wasm") {
					//@ts-ignore
					columns = columns.map((t) => t.toJSON());
				}
				// Build the schema tree structure
				return {
					key: `${database}.${schema}.${table}`,
					database,
					schema,
					table,
					columns,
				};
			}),
		);

		schema.value = _schema;
	};

	return { schema, updateSchemaDetails };
});
