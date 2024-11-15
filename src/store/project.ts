import {useToast} from "@/components/ui/toast";
import {encodeJsonToBase64Url, expandKeys, shortenKeys} from "@/lib/utils.ts";
import {useMetaStore} from "@/store/meta.ts";
import {useStorage} from "@vueuse/core";
import {computed, type Ref} from "vue";
import {useRouter} from "vue-router";
import {projectKeyMap} from "@/lib/constants.ts";

export type Project = {
  id: number | string;
  name: string;
  mode: string;
  dirty: boolean;
  order?: number;
  cells: Cell[];
};
type CellType = "markdown" | "sql";

type Cell = {
  id: number;
  query?: string;
  markdown?: string;
  position: number;
  type: CellType;
};

const prefixes = [
  "Data",
  "Query",
  "Insight",
  "Metric",
  "Stat",
  "Predict",
  "Analyze",
  "Cluster",
  "Compute",
  "Delta",
];
const nouns = [
  "Hub",
  "Forge",
  "Sphere",
  "Sync",
  "Lab",
  "Matrix",
  "Engine",
  "Flow",
  "Stack",
  "Nest",
];
const suffixes = [
  "AI",
  "Analytics",
  "DB",
  "SQL",
  "Cloud",
  "Bridge",
  "Tech",
  "Wave",
  "Stream",
  "Vision",
];

const generateProjectName = () => {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${noun}${suffix}`;
};

export const useProjects = () => {
  const {toast} = useToast();
  const $meta = useMetaStore();
  const $router = useRouter();

  const projects: Ref<Project[]> = useStorage("projects", []);
  const activeProject: Ref<Project> = useStorage("activeProject", {
    id: Date.now().valueOf(),
    name: generateProjectName(),
    cells: [
      {
        id: Date.now().valueOf(),
        query: "select 1 + 1 as result;",
        type: "sql",
        position: 0,
      },
    ],
    mode: "notebook",
    dirty: false,
  });

  const createProject = () => {
    const project: Project = {
      id: Date.now().valueOf(),
      name: generateProjectName(),
      cells: [
        {
          id: Date.now().valueOf(),
          query: "select 1 + 1 as result;",
          type: "sql",
          position: 0,
        },
      ],
      mode: "console",
      dirty: false,
    };
    projects.value.push(project);
    activeProject.value = project;
  };

  const addCell = (cell_type: CellType, query: string | null) => {
    const obj = {
      id: Date.now().valueOf(),
      type: cell_type,
      position:
          Math.max(...activeProject.value.cells.map((x) => x.position)) + 1,
      query: "",
      markdown: "",
    };
    if (cell_type === "sql") {
      obj.query = query ?? "select 1 + 1 as result";
    } else {
      obj.markdown = query ?? "#hello";
    }
    activeProject.value.cells.push(obj);
    activeProject.value.dirty = true;
  };

  const convertToConsole = () => {
    const singleCell = activeProject.value.cells.reduce(
        (acc, next) => {
          acc.query += next.query || "";
          return acc;
        },
        {
          id: Date.now().valueOf(),
          type: "sql",
          query: "",
          position: 0,
        },
    );
    activeProject.value = {
      ...activeProject.value,
      cells: [singleCell],
      mode: "console",
    };
    activeProject.value.dirty = true;
    $meta.cmdMenu = false;
  };

  const convertToNotebook = () => {
    activeProject.value = {
      ...activeProject.value,
      cells: [{...activeProject.value.cells[0]}],
      mode: "notebook",
    };
    activeProject.value.dirty = true;
    $meta.cmdMenu = false;
  };

  const updatePositions = () => {
    activeProject.value.cells = [
      ...activeProject.value.cells.map((cell: Cell, index: number) => {
        cell.position = index + 1;
        return cell;
      }),
    ];
    console.log(activeProject.value.cells);
  };

  const moveUp = (id: number) => {
    const index = activeProject.value.cells.findIndex((c) => c.id === id);
    if (index <= 0) return; // Can't move up the first element

    // Swap current cell with the previous one
    const prevCell = activeProject.value.cells[index - 1];
    activeProject.value.cells[index - 1] = activeProject.value.cells[index];
    activeProject.value.cells[index] = prevCell;

    // Update all positions to be contiguous
    updatePositions();
    activeProject.value.dirty = true;
  };

  const moveDown = (id: number) => {
    const index = activeProject.value.cells.findIndex((c) => c.id === id);
    if (index === -1 || index === activeProject.value.cells.length - 1) return; // Can't move down the last element

    // Swap current cell with the next one
    const nextCell = activeProject.value.cells[index + 1];
    activeProject.value.cells[index + 1] = activeProject.value.cells[index];
    activeProject.value.cells[index] = nextCell;

    // Update all positions to be contiguous
    updatePositions();
    activeProject.value.dirty = true;
  };

  const sortedCells = computed(() => {
    //@ts-ignore
    return activeProject.value.cells.toSorted(
        (a: Cell, b: Cell) => a.position - b.position,
    );
  });

  const deleteCell = (id: number) => {
    activeProject.value.cells.sort((a, b) => a.position - b.position);

    // Find the index of the item to delete
    const index = activeProject.value.cells.findIndex((c) => c.id === id);

    // If item not found, do nothing
    if (index === -1) return;

    // Remove the item from the array
    activeProject.value.cells.splice(index, 1);

    updatePositions();
    activeProject.value.dirty = true;
    $meta.cmdMenu = false;
    toast({title: "Cell deleted 🗑"});
  };

  const saveProject = () => {
    const project = {...activeProject.value};
    const newProjects = [
      ...projects.value.filter((p) => p.id !== project.id),
      project,
    ];
    projects.value = [...newProjects];
    $meta.cmdMenu = false;
    activeProject.value.dirty = false;
    toast({
      title: "Project has been saved ❤",
      description: `${project.name} saved. Now you can safely switch to another or continue your work`,
    });
  };

  const setActiveProject = (project: Project) => {
    $router.push("/");
    activeProject.value = project;
    $meta.cmdMenu = false;
  };

  const shareProject = () => {
    const project = {...activeProject.value, id: null};
    const project_in_url = encodeJsonToBase64Url(shortenKeys(project, projectKeyMap) as Record<string, string>);
    const url = `${window.location.origin}/import/${project_in_url}`;
    $meta.cmdMenu = false;
    $meta.shareLink = url;
    return url;
  };

  const importSharedProject = (project_json: Project) => {
    saveProject();
    const existingProjectName = activeProject.value.name;
    const project = {...project_json, id: Date.now().valueOf()}
    activeProject.value = expandKeys(project, projectKeyMap) as Project;
    toast({
      title: "Project has been imported!",
      description: `Existing project ${existingProjectName} has been backed up and ${project_json.name} set as active`,
    });
  };
  const convertProjectTo = (what: string) => {
    if (!["notebook", "console"].includes(what)) return;
    activeProject.value.mode = what;
    $meta.cmdMenu = false;
  };

  return {
    projects,
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
    importSharedProject,
    convertProjectTo,
  };
};
