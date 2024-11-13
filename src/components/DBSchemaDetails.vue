<script setup lang="ts">
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { db_events } from "@/store/meta.ts";
import type { AsyncDuckDB } from "duckdb-wasm-kit";
import { onMounted, ref } from "vue";

const { db, ready } = useDuckDb();

const events = ref<string[]>([]);
const schema = ref<SchemaTree>();

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

const getSchemaDetails = async (db: AsyncDuckDB): Promise<SchemaTree> => {
	await ready;
	const conn = await db.connect();

	// Step 1: Get all schemas
	const schemasResult = await conn.query(`
		SELECT table_catalog as database, table_schema as schema, table_name as table
		FROM information_schema.tables
		WHERE table_catalog NOT IN ('system', 'temp')
		AND table_schema NOT IN ('information_schema', 'pg_catalog')
	`);
	const schemas = schemasResult.toArray().map((t) => t.toJSON());

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

	return schemaTree;
};

const updateSchemaDetails = async () => {
	if (!db.value) return;
	schema.value = await getSchemaDetails(db.value);
};

db_events.on(async (msg) => {
	if (msg === "UPDATE_SCHEMA") {
		await updateSchemaDetails();
	}
	events.value.push(msg as string);
});

onMounted(() => {
	updateSchemaDetails();
});
</script>

<template>
  <div class="space-y-2 my-2">
    <div v-if="Object.keys(schema || {}).length == 0" class="text-center p-2">no tables yet ✨</div>
    <Collapsible v-else
                 v-for="table in schema"
                 class="space-y-2 w-full"
                 default-open
    >
      <div class="flex items-center justify-between space-x-4">
        <CollapsibleTrigger as-child>
          <h4 class="text-sm font-semibold flex items-center space-x-2">
            <div class="i-solar:database-bold-duotone h-6 w-6"></div>
            <span>--</span>
          </h4>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="space-y-2">
        <pre>{{table}}</pre>
<!--        <Table class="text-sm">-->
<!--          <TableHeader>-->
<!--            <TableRow>-->
<!--              <TableHead class="w-[100px]">-->
<!--                name-->
<!--              </TableHead>-->
<!--              <TableHead>type</TableHead>-->
<!--              <TableHead>not null</TableHead>-->
<!--              <TableHead>default value</TableHead>-->
<!--              <TableHead>primary key</TableHead>-->
<!--            </TableRow>-->
<!--          </TableHeader>-->
<!--          <TableBody>-->
<!--            <TableRow v-for="column in schema[key]">-->
<!--              <TableCell class="font-medium">-->
<!--                {{ column.name }}-->
<!--              </TableCell>-->
<!--              <TableCell>{{ column?.type.toLowerCase() }}</TableCell>-->
<!--              <TableCell>{{ column?.notnull }}</TableCell>-->
<!--              <TableCell>{{ column?.dflt_value }}</TableCell>-->
<!--              <TableCell>{{ column?.pk }}</TableCell>-->
<!--            </TableRow>-->
<!--          </TableBody>-->
<!--        </Table>-->
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>

<style scoped>

</style>