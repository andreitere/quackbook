type SQLConfig = {
  backend: string;
  host: string;
}

type ProjectMeta = {
  id: number | string;
  name: string;
  mode: string;
  dirty: boolean;
  sql: SQLConfig
}

type Project = ProjectMeta & {
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

type SomeObj = Record<string, unknown>;