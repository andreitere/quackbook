import {type DataType, Type} from "apache-arrow";
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bytesToGB = (bytes: number) => (bytes / 1024 ** 3).toFixed(2);

export const encodeJsonToBase64Url = (jsonObject: Record<string, unknown>) => {
  // Convert the JSON object to a JSON string
  const jsonString = JSON.stringify(jsonObject);

  // Encode to Base64 using TextEncoder and Uint8Array to handle Unicode
  const utf8Bytes = new TextEncoder().encode(jsonString);
  const base64String = btoa(String.fromCharCode(...utf8Bytes));

  // Make the Base64 string URL-friendly by replacing characters
  return base64String
      .replace(/\+/g, "-") // Replace '+' with '-'
      .replace(/\//g, "_") // Replace '/' with '_'
      .replace(/=+$/, ""); // Remove trailing '=' characters
};

export const decodeBase64UrlToJson = (base64UrlString: string) => {
  // Convert URL-safe Base64 to standard Base64
  const base64String = base64UrlString
      .replace(/-/g, "+") // Replace '-' back to '+'
      .replace(/_/g, "/") // Replace '_' back to '/'
      .padEnd(
          base64UrlString.length + ((4 - (base64UrlString.length % 4)) % 4),
          "=",
      );

  // Decode Base64 to binary string
  const binaryString = atob(base64String);

  // Convert binary string back to UTF-8 bytes, then to a JSON string
  const utf8Bytes = new Uint8Array(
      [...binaryString].map((char) => char.charCodeAt(0)),
  );
  const jsonString = new TextDecoder().decode(utf8Bytes);

  // Parse the JSON string back to an object
  return JSON.parse(jsonString);
};

export const arrowTypeToJsType = (arrowType: DataType) => {
  switch (arrowType.typeId) {
    case Type.Int:
      return "integer"; // All smaller integers can be represented as 'number'
    case Type.Int8:
    case Type.Int16:
    case Type.Int32:
    case Type.Int64:
      return "string"; // Int64 can map to 'bigint' in JavaScript
    case Type.Decimal:
    case Type.Float:
    case Type.Float16:
    case Type.Float32:
    case Type.Float64:
      return "string"; // Both Float32 and Float64 map to 'number'
    case Type.Utf8:
      return "string"; // UTF-8 strings map to JavaScript 'string'
      // case Type.Date32:
      // case Type.Date64:
    case Type.Date:
    case Type.DateDay:
    case Type.DateMillisecond:
    case Type.Timestamp:
      return "date"; // Date32 and Date64 map to JavaScript's Date object
    case Type.Bool:
      return "boolean"; // Boolean maps to JavaScript 'boolean'Timestamps can also map to JavaScript's Date
    case Type.Struct:
      return "object"; // Structs map to JavaScript objects
    case Type.List:
      return "string"; // Lists map to JavaScript arrays
    case Type.Dictionary:
      return "string"; // Dictionary types (often categorical) can be strings
    default:
      console.log(arrowType);
      return "unknown"; // Fallback for any types not covered
  }
};

type SomeObj = Record<string, unknown>;
// Recursively shorten keys based on provided keyMap
export const shortenKeys = (obj: SomeObj, keyMap: SomeObj): SomeObj | SomeObj[] => {
  if (Array.isArray(obj)) {
    //@ts-ignore
    return obj.map((item) => shortenKeys(item, keyMap));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const shortKey = keyMap[key] || key;
      //@ts-ignore
      acc[shortKey] = shortenKeys(value, keyMap); // Recursively shorten nested objects/arrays
      return acc;
    }, {});
  }

  return obj; // Return value if not an object/array
};

// Recursively expand keys based on provided reverseKeyMap
export const expandKeys = (obj: SomeObj, keyMap: SomeObj): SomeObj | SomeObj[] => {
  const reverseKeyMap = generateReverseKeyMap(keyMap)
  if (Array.isArray(obj)) {
    //@ts-ignore
    return obj.map((item) => expandKeys(item, reverseKeyMap));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const originalKey = reverseKeyMap[key] || key;
      //@ts-ignore
      acc[originalKey] = expandKeys(value, reverseKeyMap); // Recursively expand nested objects/arrays
      return acc;
    }, {});
  }

  return obj; // Return value if not an object/array
};

// Generate a reverse key map from the provided key map
export const generateReverseKeyMap = (keyMap: SomeObj) =>
    Object.fromEntries(Object.entries(keyMap).map(([k, v]) => [v, k]));