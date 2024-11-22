<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { db_events, useMetaStore } from "@/store/meta.ts";
import { insertFile } from "duckdb-wasm-kit";
import { ref } from "vue";

const { toast } = useToast();
const $meta = useMetaStore();

const files = ref<{ name: string; file: File }[]>([]);
const { db, ready } = useDuckDb();
const importing = ref<boolean>(false);

const onFilesPicked = (event: Event) => {
	files.value = [];
	const _files = (event.target as HTMLInputElement).files;
	if (!_files) return;
	for (const file of _files) {
		files.value.push({
			name: file.name.split(".")[0],
			file: file,
		});
	}
};

const doImport = async () => {
	importing.value = true;
	await ready();
	if (!db.value) return;
	for (const file of files.value) {
		await insertFile(db.value, file.file, file.name);
	}
	importing.value = false;
	$meta.showImportFiles = false;
	files.value = [];
	db_events.emit("UPDATE_SCHEMA");
	toast({
		title: "Import succesfull",
		description: "You can query your files now",
	});
};

const doCancel = () => {
	$meta.showImportFiles = false;
	files.value = [];
};
</script>

<template>
  <Dialog v-model:open="$meta.showImportFiles">
    <DialogContent class="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Import files</DialogTitle>
        <DialogDescription>
          Easily import your local files in CSV, Parquet, or Arrow formats to get started
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-end space-x-2">
        <div class="grid w-full items-center align-baseline gap-1.5 flex-grow">
          <h2>Pick your files</h2>
          <Input id="importfiles" type="file" multiple accept=".csv, .parquet, .arrow" @change="onFilesPicked"/>
        </div>
        <!--        <Button variant="destructive">reset</Button>-->
      </div>
      <div v-if="files.length" class="space-y-2">
        <h2 class="font-bold">Configure target table for each file</h2>
        <div class="space-y-4 flex flex-col">
          <div v-for="file in files" class="flex flex-col text-sm space-y-1">
            <Label>Table name for: <span class="text-amber">{{ file.file.name }}</span></Label>
            <Input v-model="file.name"/>
          </div>
        </div>
      </div>
      <DialogFooter class="items-center">
        <div class="i-line-md:loading-twotone-loop h-5 w-5" v-if="importing"></div>
        <Button @click="doCancel" variant="outline" data-umami-event="cancel-import-files" :disabled="importing">
          Cancel
        </Button>
        <Button @click="doImport" data-umami-event="do-import-files" :disabled="importing">
          Import
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>