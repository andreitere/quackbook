import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { computed, ref } from "vue";

type Column = {
	name: string;
	type: string;
	notnull: boolean;
	dflt_value: string | null;
	pk: number;
};

type DBTable = {
	table: string;
	columns: Column[];
};

type SchemaTree = {
	[database: string]: {
		[schema: string]: {
			[table: string]: DBTable;
		};
	};
};
export type DataModelNode = {
	id: string | number;
	label: string;
	children?: DataModelNode[];
	type: string;
};

export const useDBSchema = () => {
	const { ready, db } = useDuckDb();
	const schema = ref<SchemaTree>();

	const updateSchemaDetails = async () => {
		console.log("updateSchemaDetails");
		await ready;
		if (!db.value) {
			console.log("here");
			throw Error("duckdb not instantiated");
		}
		console.log("connecting...");
		const conn = await db.value.connect();
		console.log("connected...");
		// Step 1: Get all schemas
		const schemasResult = await conn.query(`
			SELECT table_catalog as database, table_schema as schema, table_name as table
			FROM information_schema.tables
			WHERE table_catalog NOT IN ('system')
			AND table_schema NOT IN ('information_schema', 'pg_catalog')
		`);
		console.log("got schema...");
		const schemas = schemasResult.toArray().map((t) => t.toJSON());
		console.log(schemas);
		// Step 2: For each schema, get all tables and build the tree
		const schemaTree: SchemaTree = {};

		await Promise.allSettled(
			schemas.map(async ({ database, schema, table }) => {
				const tableInfo = await conn.query(
					`PRAGMA table_info('${database}.${schema}.${table}')`,
				);
				const columns = tableInfo.toArray().map((c) => c.toJSON()) as Column[];

				// Build the schema tree structure
				if (!schemaTree[database]) {
					schemaTree[database] = {};
				}
				if (!schemaTree[database][schema]) {
					schemaTree[database][schema] = {};
				}
				schemaTree[database][schema][table] = { table, columns };
			}),
		);

		schema.value = schemaTree;
		console.log(schema.value);
	};

	const schemaTree = computed(() => {
		if (!schema.value) return [];
		const dataModel: DataModelNode[] = [];
		for (const [database, schemas] of Object.entries(schema.value)) {
			const databaseNode: DataModelNode = {
				id: database,
				label: database,
				type: "database",
				children: [],
			};

			for (const [schema, tables] of Object.entries(schemas)) {
				const schemaNode: DataModelNode = {
					id: `${database}.${schema}`,
					label: schema,
					type: "schema",
					children: [],
				};
				for (const [table, tableInfo] of Object.entries(tables)) {
					const tableNode: DataModelNode = {
						id: `${database}.${schema}.${table}`,
						label: table,
						type: "table",
						children: tableInfo.columns.map((column: Column) => ({
							id: `${database}.${schema}.${table}.${column.name}`,
							label: column.name,
							type: "column",
							metadata: {
								...column,
							},
						})),
					};
					schemaNode.children?.push(tableNode);
				}
				databaseNode.children?.push(schemaNode);
			}
			dataModel.push(databaseNode);
		}
		return dataModel;
	});

	return { schema, updateSchemaDetails, schemaTree };
};
