import {useStorage} from "@vueuse/core";
import {computed, Ref} from "vue";
import {useToast} from "@/components/ui/toast";
import {useMetaStore} from "@/store/meta.ts";

type Project = {
  id: number | string;
  name: string;
  mode: string;
  dirty: boolean;
  order?: number;
  cells: any[];
}
type CellType = "markdown" | "sql";

type Cell = {
  id: number | string;
  query?: string;
  markdown?: string;
  position: number;
  type: CellType
}

const prefixes = ["Data", "Query", "Insight", "Metric", "Stat", "Predict", "Analyze", "Cluster", "Compute", "Delta"];
const nouns = ["Hub", "Forge", "Sphere", "Sync", "Lab", "Matrix", "Engine", "Flow", "Stack", "Nest"];
const suffixes = ["AI", "Analytics", "DB", "SQL", "Cloud", "Bridge", "Tech", "Wave", "Stream", "Vision"];

const generateProjectName = () => {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${noun}${suffix}`;
};

export const useProjects = () => {
  const {toast} = useToast()
  const $meta = useMetaStore()

  const projects: Ref<Project[]> = useStorage("projects", [])
  const activeProject: Ref<Project> = useStorage("activeProject", {
    id: Date.now().valueOf(),
    name: generateProjectName(), cells: [
      {
        id: Date.now().valueOf(),
        query: `select 1 + 1 as result;`,
        type: "sql",
        position: 0
      }
    ], mode: "console", dirty: false
  })

  const createProject = () => {
    let project: Project = {
      id: Date.now().valueOf(), name: generateProjectName(), cells: [
        {
          id: Date.now().valueOf(),
          query: `select 1 + 1 as result;`,
          type: "sql",
          position: 0
        }
      ], mode: "console", dirty: false
    }
    projects.value.push(project)
    activeProject.value = project;
  }

  const addCell = (cell_type: CellType, query: string = 'select 1 + 1 as result') => {
    activeProject.value.cells.push({
      query,
      id: Date.now().valueOf(),
      type: cell_type,
      position: Math.max(...(activeProject.value.cells.map(x => x.position))) + 1
    })
  }

  const convertToConsole = () => {
    let singleCell = activeProject.value.cells.reduce((acc, next) => {
      acc.query += next.query
      return acc;
    }, {
      id: Date.now().valueOf(),
      type: "sql",
      query: ""
    })
    activeProject.value = {
      ...activeProject.value,
      cells: [singleCell],
      mode: "console",
    }
  }

  const convertToNotebook = () => {
    activeProject.value = {
      ...activeProject.value,
      cells: [{...activeProject.value.cells[0]}],
      mode: "notebook",
    }
  }

  // move up visually (basically inverse order)
  const moveUp = (cell: Cell) => {
    const index = activeProject.value.cells.findIndex(c => c.id === cell.id);
    console.log(`moveUp`, {index})
    const prevIndex = activeProject.value.cells.findIndex(c => c.position == (cell.position - 1));
    activeProject.value.cells[prevIndex].position = cell.position;
    activeProject.value.cells[index].position = cell.position - 1;
    console.table(activeProject.value.cells)
  };

  // move down visually (basically inverse order)
  const moveDown = (cell: Cell) => {
    const index = activeProject.value.cells.findIndex(c => c.id === cell.id);
    console.log(`moveDown`, {index})
    const nextIndex = activeProject.value.cells.findIndex(c => c.position == (cell.position + 1));
    activeProject.value.cells[nextIndex].position = cell.position;
    activeProject.value.cells[index].position = cell.position + 1;
    console.table(activeProject.value.cells)
  };

  const sortedCells = computed(() => {
    return activeProject.value.cells.toSorted((a, b) => a.position - b.position);
  });

  const deleteCell = (id: number) => {
    activeProject.value.cells.sort((a, b) => a.position - b.position);

    // Find the index of the item to delete
    const index = activeProject.value.cells.findIndex(c => c.id === id);

    // If item not found, do nothing
    if (index === -1) return;

    // Remove the item from the array
    activeProject.value.cells.splice(index, 1);

    // Recompute positions to keep them sequential (0, 1, 2, ...)
    activeProject.value.cells.forEach((cell, idx) => {
      cell.position = idx;
    });
    $meta.cmdMenu = false;
    toast({title: 'Cell deleted 🗑️'})
  }

  const saveProject = () => {
    const project = {...activeProject.value};
    const newProjects = [...projects.value.filter(p => p.id !== project.id), project];
    projects.value = [...newProjects]
    $meta.cmdMenu = false;
    toast({title: `Project has been saved ❤️‍🔥`, description: `${project.name} saved. Now you can safely switch to another or continue your work`})
  }

  const setActiveProject = (project) => {
    activeProject.value = project;
  }

  return {projects, activeProject, createProject, addCell, convertToConsole, convertToNotebook, moveDown, moveUp, sortedCells, deleteCell, saveProject, setActiveProject}
}