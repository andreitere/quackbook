import {useProjects} from "@/store/project.ts";
import ky from "ky";
import type {Field} from "apache-arrow";
import {arrowTypeToJsType} from "@/lib/utils.ts";

export const useDuckDBServer = () => {
  const $project = useProjects()
  const query = async (queryStr: string) => {
    const json = await ky.post<{ rows: any[], schema: Record<string, string>[] }>(`${$project.activeProject.value.sql.host}/`, {json: {query: queryStr}}).json();
    const schema = json.schema.reduce(
        //@ts-ignore
        (acc: Record<string, string>, next: Field) => {
          acc[next?.name as string] = arrowTypeToJsType(next.type);
          return acc;
        },
        {},
    );
    return {records: json.rows, schema, query: queryStr}
  }
  return {query}
}