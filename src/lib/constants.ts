export const projectKeyMap = {
  id: 'i',
  name: 'n',
  mode: 'm',
  dirty: 'd',
  order: 'o',
  cells: 'c',
  query: 'q',
  sql: 's',
  backend: 'b',
  port: 'po',
  markdown: 'md',
  position: 'p',
  type: 't',
  host: 'h'
};


export const defaultProjectCells: Cell[] = [
  {
    id: Date.now().valueOf() + 1,
    type: "markdown",
    markdown: "### Welcome to your new project",
    position: 0
  },
  {
    id: Date.now().valueOf(),
    query: "select 1 + 1 as result;",
    type: "sql",
    position: 1,
  },
]