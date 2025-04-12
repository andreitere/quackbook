import type { Ref } from 'vue';
import { useToast } from '@/components/ui/toast';
import { defaultProjectCells, projectKeyMap } from '@/lib/constants.ts';
import { encodeJsonToBase64Url, expandKeys, shortenKeys } from '@/lib/utils.ts';
import { useMetaStore } from '@/store/meta.ts';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const prefixes = [
    'Data',
    'Query',
    'Insight',
    'Metric',
    'Stat',
    'Predict',
    'Analyze',
    'Cluster',
    'Compute',
    'Delta',
];
const nouns = [
    'Hub',
    'Forge',
    'Sphere',
    'Sync',
    'Lab',
    'Matrix',
    'Engine',
    'Flow',
    'Stack',
    'Nest',
];
const suffixes = [
    'AI',
    'Analytics',
    'DB',
    'SQL',
    'Cloud',
    'Bridge',
    'Tech',
    'Wave',
    'Stream',
    'Vision',
];

function generateProjectName() {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix}${noun}${suffix}`;
}

export const useProjects = defineStore('projects', () => {
    const { toast } = useToast();
    const $meta = useMetaStore();
    const $router = useRouter();
    const shareableProject = ref('');
    const projects: Ref<Project[]> = useStorage('projects', []);
    const activeProjectCells = useStorage<Cell[]>('activeProjectCells', [
        ...defaultProjectCells,
    ]);
    const activeProjectMeta = useStorage<ProjectMeta>('activeProjectMeta', {
        id: Date.now().valueOf(),
        name: generateProjectName(),
        sql: {
            backend: 'duckdb_wasm',
            host: 'http://localhost:8000',
        },
        mode: 'notebook',
        dirty: false,
    });

    const createProject = () => {
        activeProjectMeta.value = {
            id: Date.now().valueOf(),
            name: generateProjectName(),
            sql: {
                backend: 'duckdb_wasm',
                host: 'http://localhost:8000',
            },
            mode: 'notebook',
            dirty: false,
        };
        $router.push('/');
        activeProjectCells.value = [...defaultProjectCells];
    };

    const addCell = (cell_type: CellType, query: string | null) => {
        const obj = {
            id: Date.now().valueOf(),
            type: cell_type,
            position:
        Math.max(...activeProjectCells.value.map(x => x.position)) + 1,
            query: '',
            markdown: '',
        };
        if (cell_type === 'sql') {
            obj.query = query ?? 'select 1 + 1 as result';
        }
        else {
            obj.markdown = query ?? '#hello';
        }
        activeProjectCells.value.push(obj);
        activeProjectMeta.value.dirty = true;
    };

    const convertToConsole = () => {
        const singleCell = activeProjectCells.value
            .filter(c => c.type === 'sql')
            .reduce(
                (acc, next) => {
                    acc.query += next.query || '';
                    return acc;
                },
                {
                    id: Date.now().valueOf(),
                    type: 'sql',
                    query: '',
                    position: 0,
                },
            );
        activeProjectCells.value = [singleCell];
        activeProjectMeta.value = {
            ...activeProjectMeta.value,
            mode: 'console',
            dirty: true,
        };
        $meta.cmdMenu = false;
    };

    const convertToNotebook = () => {
        activeProjectMeta.value.mode = 'notebook';
        activeProjectMeta.value.dirty = true;
        activeProjectCells.value = [{ ...activeProjectCells.value[0] }];
        $meta.cmdMenu = false;
    };

    const updatePositions = () => {
        activeProjectCells.value = [
            ...activeProjectCells.value.map((cell: Cell, index: number) => {
                cell.position = index + 1;
                return cell;
            }),
        ];
    };

    const moveUp = (id: number) => {
        const index = activeProjectCells.value.findIndex(c => c.id === id);
        if (index <= 0)
            return; // Can't move up the first element

        // Swap current cell with the previous one
        const prevCell = activeProjectCells.value[index - 1];
        activeProjectCells.value[index - 1] = activeProjectCells.value[index];
        activeProjectCells.value[index] = prevCell;

        // Update all positions to be contiguous
        updatePositions();
        activeProjectMeta.value.dirty = true;
    };

    const moveDown = (id: number) => {
        const index = activeProjectCells.value.findIndex(c => c.id === id);
        if (index === -1 || index === activeProjectCells.value.length - 1)
            return; // Can't move down the last element

        // Swap current cell with the next one
        const nextCell = activeProjectCells.value[index + 1];
        activeProjectCells.value[index + 1] = activeProjectCells.value[index];
        activeProjectCells.value[index] = nextCell;

        // Update all positions to be contiguous
        updatePositions();
        activeProjectMeta.value.dirty = true;
    };

    const sortedCells = computed(() => {
    // @ts-ignore
        return activeProjectCells.value.toSorted(
            (a: Cell, b: Cell) => a.position - b.position,
        );
    });

    const deleteCell = (id: number) => {
        activeProjectCells.value.sort((a, b) => a.position - b.position);

        // Find the index of the item to delete
        const index = activeProjectCells.value.findIndex(c => c.id === id);

        // If item not found, do nothing
        if (index === -1)
            return;

        // Remove the item from the array
        activeProjectCells.value.splice(index, 1);

        updatePositions();
        activeProjectMeta.value.dirty = true;
        $meta.cmdMenu = false;
        toast({ title: 'Cell deleted 🗑' });
    };

    const saveProject = () => {
        const project = {
            ...activeProjectMeta.value,
            cells: [...activeProjectCells.value],
        };
        const newProjects = [
            ...projects.value.filter(p => p.id !== project.id),
            project,
        ];
        projects.value = [...newProjects];
        $meta.cmdMenu = false;
        activeProjectMeta.value.dirty = false;
        toast({
            title: 'Project has been saved ❤',
            description: `${project.name} saved. Now you can safely switch to another or continue your work`,
        });
    };

    const setActiveProject = (project: Project) => {
        $router.push('/');
        const { cells, ...meta } = project;
        activeProjectMeta.value = meta;
        activeProjectCells.value = cells;
        $meta.cmdMenu = false;
    };

    const shareProject = () => {
        const project = {
            ...activeProjectMeta.value,
            cells: [...activeProjectCells.value],
        };
        shareableProject.value = JSON.stringify(
            shortenKeys({ ...project, id: null }, projectKeyMap),
        );
        const project_in_url = encodeJsonToBase64Url(shareableProject.value);
        const url = `${window.location.origin}/#/projects/${project_in_url}`;
        $meta.cmdMenu = false;
        $meta.shareLink = url;
        return url;
    };

    const importSharedProject = (project_json: Project) => {
        saveProject();
        const existingProjectName = activeProjectMeta.value.name;
        const project = { ...project_json, id: Date.now().valueOf() };
        const { cells, ...meta } = expandKeys(project, projectKeyMap) as Project;
        activeProjectCells.value = cells;
        activeProjectMeta.value = meta;
        toast({
            title: 'Project has been imported!',
            description: `Existing project ${existingProjectName} has been backed up and ${project_json.name} set as active`,
        });
    };
    const convertProjectTo = (what: string) => {
        if (!['notebook', 'console'].includes(what))
            return;
        activeProjectMeta.value.mode = what;
        $meta.cmdMenu = false;
    };

    const activeProject = computed(() => {
        return {
            ...activeProjectMeta.value,
            cells: [...activeProjectCells.value],
        };
    });

    return {
        projects,
        activeProjectMeta,
        activeProjectCells,
        activeProject,
        createProject,
        addCell,
        convertToConsole,
        convertToNotebook,
        moveDown,
        moveUp,
        sortedCells,
        deleteCell,
        saveProject,
        setActiveProject,
        shareProject,
        shareableProject,
        importSharedProject,
        convertProjectTo,
    };
});
