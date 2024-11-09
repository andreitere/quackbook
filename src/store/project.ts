import {useStorage} from "@vueuse/core";
import {Ref} from "vue";

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
  const projects: Ref<Project[]> = useStorage("projects", [])
  const activeProject: Ref<Project> = useStorage("activeProject", {
    id: "", name: generateProjectName(), cells: [
      {
        id: Date.now().valueOf(),
        query: `select 1 + 1 as result;`,
        type: "sql"
      }
    ], mode: "console", dirty: false
  })

  const createProject = () => {
    let project: Project = {
      id: Date.now().valueOf(), name: generateProjectName(), cells: [
        {
          id: Date.now().valueOf(),
          query: `select 1 + 1 as result;`,
          type: "sql"
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
      type: cell_type
    })
  }

  const deleteCell = (cell: Cell) => {
    activeProject.value.cells = activeProject.value.cells.filter(c => c.id !== cell.id)
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


  return {projects, activeProject, createProject, addCell, convertToConsole, convertToNotebook, deleteCell}
}