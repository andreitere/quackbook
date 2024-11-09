<script setup lang="ts">
import {useDuckDb} from "@/hooks/useDuckDb.ts";
import {db_events} from "@/store/meta.ts";
import {onMounted, ref, Ref} from "vue";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {AsyncDuckDB} from "duckdb-wasm-kit";

const {db, ready} = useDuckDb()

const events: Ref<string[]> = ref([])
const schema: Ref<Record<string, Record<string, any>>> = ref({})

const getSchemaDetails = async (db: AsyncDuckDB) => {
  await ready;
  const conn = await db.connect();

  // Step 1: Get all schemas
  const schemasResult = await conn.query(`
    SELECT table_catalog as database, table_schema as schema, table_name as table
    FROM information_schema.tables
    WHERE table_catalog not in ('system', 'temp') and table_schema not in ('information_schema', 'pg_catalog')
  `);
  const schemas = schemasResult.toArray().map(t => t.toJSON())
  console.log(schemas)

  // Step 2: For each schema, get all tables
  let results = await Promise.allSettled(
      schemas.map(async (args) => {
        const {database, schema, table} = args;
        const tableInfo = await conn.query(`PRAGMA table_info('${database}.${schema}.${table}')`);
        return {
          database,
          schema,
          table,
          columns: tableInfo.toArray().map(c => c.toJSON())
        }
      })
  )
  let _db_schemas: Record<string, any> = {}
  console.log(results)
  results.filter(r => r.status === 'fulfilled').forEach(item => {
    const {database, schema, table, columns} = item.value;
    _db_schemas[`${database}.${schema}.${table}`] = columns;
    // if (!_db_schemas[`${database}.${schema}.${table}`]) {
    // }
  });

  return _db_schemas as Record<string, Record<string, any>>;
}

const updateSchemaDetails = async () => {
  if (!db.value) return;
  schema.value = (await getSchemaDetails(db.value));
}

db_events.on(async (msg) => {
  if (msg === "UPDATE_SCHEMA") {
    await updateSchemaDetails()
  }
  events.value.push(msg as string)
})

onMounted(() => {
  updateSchemaDetails()
})
</script>

<template>
  <div class="space-y-2 my-2">
    <div v-if="Object.keys(schema || {}).length == 0" class="text-center p-2">no tables yet ✨</div>
    <Collapsible v-else
                 v-for="key in Object.keys(schema)"
                 class="space-y-2 w-full"
                 default-open
    >
      <div class="flex items-center justify-between space-x-4">
        <CollapsibleTrigger as-child>
          <h4 class="text-sm font-semibold flex items-center space-x-2">
            <div class="i-solar:database-bold-duotone h-6 w-6"></div>
            <span>{{ key }}</span>
          </h4>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="space-y-2">
        <Table class="text-sm">
          <TableHeader>
            <TableRow>
              <TableHead class="w-[100px]">
                name
              </TableHead>
              <TableHead>type</TableHead>
              <TableHead>not null</TableHead>
              <TableHead>default value</TableHead>
              <TableHead>primary key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="column in schema[key]">
              <TableCell class="font-medium">
                {{ column.name }}
              </TableCell>
              <TableCell>{{ column.type.toLowerCase() }}</TableCell>
              <TableCell>{{ column.notnull }}</TableCell>
              <TableCell>{{ column.dflt_value }}</TableCell>
              <TableCell>{{ column.pk }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>

<style scoped>

</style>