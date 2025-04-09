import { useSQLBackend } from "@/hooks/useSQLBackend";
import { ref } from "vue";
import { useProjects } from "./project";
import { createSharedComposable } from "@vueuse/core";

export type Column = {
	column_name: string;
	data_type: string;
	is_nullable: boolean;
	column_default?: string;
	is_identity: boolean;
};

export type Table = {
	name: string;
	columns: Column[];
};

export type Schema = {
	name: string;
	tables: Record<string, Table>;
};

export type Database = {
	name: string;
	schemas: Record<string, Schema>;
};

export type SchemaTree = Record<string, Database>;

export const useDBSchema = createSharedComposable(() => {
	const { execute } = useSQLBackend();
	const { activeProjectMeta } = useProjects();
	const schema = ref<SchemaTree>({});

	const updateSchemaDetails = async () => {
		// Step 1: Get all schemas
		const result = await execute(`
			SELECT table_catalog as database, table_schema as schema, table_name as table
			FROM information_schema.tables
			WHERE table_catalog NOT IN ('system')
			AND table_schema NOT IN ('information_schema', 'pg_catalog')
		`) as { records: Array<{ database: string; schema: string; table: string }> };
		
		let records = result.records;
		if (activeProjectMeta.sql.backend === "duckdb_wasm") {
			//@ts-ignore
			records = records.map((t) => t.toJSON());
		}

		// Initialize the schema tree
		const schemaTree: SchemaTree = {};

		// Step 2: For each table, get its columns and build the hierarchical structure
		for (const { database, schema: schemaName, table } of records) {
			// Initialize database if it doesn't exist
			if (!schemaTree[database]) {
				schemaTree[database] = {
					name: database,
					schemas: {}
				};
			}

			// Initialize schema if it doesn't exist
			if (!schemaTree[database].schemas[schemaName]) {
				schemaTree[database].schemas[schemaName] = {
					name: schemaName,
					tables: {}
				};
			}

			// Get columns for the table
			const columnsResult = await execute(`
				SELECT column_name, data_type, is_nullable, column_default, is_identity
				FROM information_schema.columns 
				WHERE table_catalog = '${database}' 
				AND table_schema = '${schemaName}' 
				AND table_name = '${table}'
			`) as { records: Column[] };

			let columns = columnsResult.records;
			if (activeProjectMeta.sql.backend === "duckdb_wasm") {
				//@ts-ignore
				columns = columns.map((t) => t.toJSON());
			}

			// Add table with its columns to the schema
			schemaTree[database].schemas[schemaName].tables[table] = {
				name: table,
				columns
			};
		}

		schema.value = schemaTree;
	};

	return { schema, updateSchemaDetails };
});
