import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {Type} from "apache-arrow";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bytesToGB = (bytes: number) => (bytes / Math.pow(1024, 3)).toFixed(2);


export const arrowTypeToJsType = (arrowType: keyof typeof Type) => {
  switch (arrowType.typeId) {
    case Type.Int:
    case Type.Int8:
    case Type.Int16:
    case Type.Int32:
      return 'integer';  // All smaller integers can be represented as 'number'
    case Type.Int64:
      return 'bigint';  // Int64 can map to 'bigint' in JavaScript
    case Type.Float:
    case Type.Float16:
    case Type.Float32:
    case Type.Float64:
    case Type.Decimal:
      return 'float';  // Both Float32 and Float64 map to 'number'
    case Type.Utf8:
      return 'string';  // UTF-8 strings map to JavaScript 'string'
    case Type.Date32:
    case Type.Date64:
    case Type.Date:
    case Type.DateDay:
    case Type.DateMillisecond:
    case Type.Timestamp:
      return 'date';  // Date32 and Date64 map to JavaScript's Date object
    case Type.Bool:
      return 'boolean';  // Boolean maps to JavaScript 'boolean'Timestamps can also map to JavaScript's Date
    case Type.Struct:
      return 'object';  // Structs map to JavaScript objects
    case Type.List:
      return 'string';  // Lists map to JavaScript arrays
    case Type.Dictionary:
      return 'string';  // Dictionary types (often categorical) can be strings
    default:
      console.log(arrowType)
      return 'unknown';  // Fallback for any types not covered
  }
}