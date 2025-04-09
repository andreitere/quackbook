import { type DataType, Type } from "apache-arrow"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bytesToGB = (bytes: number) => (bytes / 1024 ** 3).toFixed(2)

export const encodeJsonToBase64Url = (jsonString: string) => {
  // Convert the JSON object to a JSON string

  // Encode to Base64 using TextEncoder and Uint8Array to handle Unicode
  const utf8Bytes = new TextEncoder().encode(jsonString)
  const base64String = btoa(String.fromCharCode(...utf8Bytes))

  // Make the Base64 string URL-friendly by replacing characters
  return base64String
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_") // Replace '/' with '_'
    .replace(/=+$/, "") // Remove trailing '=' characters
}

export const decodeBase64UrlToJson = (base64UrlString: string) => {
  // Convert URL-safe Base64 to standard Base64
  const base64String = base64UrlString
    .replace(/-/g, "+") // Replace '-' back to '+'
    .replace(/_/g, "/") // Replace '_' back to '/'
    .padEnd(base64UrlString.length + ((4 - (base64UrlString.length % 4)) % 4), "=")

  // Decode Base64 to binary string
  const binaryString = atob(base64String)

  // Convert binary string back to UTF-8 bytes, then to a JSON string
  const utf8Bytes = new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)))
  const jsonString = new TextDecoder().decode(utf8Bytes)

  // Parse the JSON string back to an object
  return JSON.parse(jsonString)
}

export const arrowTypeToJsType = (arrowType: DataType) => {
  let _rType = null
  switch (arrowType.typeId) {
    case Type.Int:
      _rType = "integer"
      break // All smaller integers can be represented as 'number'
    case Type.Int8:
    case Type.Int16:
    case Type.Int32:
    case Type.Int64:
      _rType = "integer"
      break
    case Type.Decimal:
    case Type.Float:
    case Type.Float16:
    case Type.Float32:
    case Type.Float64:
      _rType = "float"
      break
    case Type.Utf8:
      _rType = "string"
      break
    // case Type.Date32:
    // case Type.Date64:
    case Type.Date:
    case Type.DateDay:
    case Type.DateMillisecond:
    case Type.Timestamp:
      _rType = "datetime"
      break
    case Type.Bool:
      _rType = "boolean"
      break
    case Type.Struct:
      _rType = "json"
      break
    case Type.List:
      _rType = "json"
      break
    case Type.Dictionary:
      _rType = "string"
      break
    default:
      _rType = "unknown"
  }
  return _rType
}

// Recursively shorten keys based on provided keyMap
export const shortenKeys = (obj: SomeObj, keyMap: SomeObj): SomeObj | SomeObj[] => {
  if (Array.isArray(obj)) {
    //@ts-ignore
    return obj.map((item) => shortenKeys(item, keyMap))
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const shortKey = keyMap[key] || key
      //@ts-ignore
      acc[shortKey] = shortenKeys(value, keyMap) // Recursively shorten nested objects/arrays
      return acc
    }, {})
  }

  return obj // Return value if not an object/array
}

// Recursively expand keys based on provided reverseKeyMap
export const expandKeys = (obj: SomeObj, keyMap: SomeObj): SomeObj | SomeObj[] => {
  const reverseKeyMap = generateReverseKeyMap(keyMap)
  if (Array.isArray(obj)) {
    //@ts-ignore
    return obj.map((item) => expandKeys(item, keyMap))
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const originalKey = reverseKeyMap[key] || key
      //@ts-ignore
      acc[originalKey] = expandKeys(value, keyMap) // Recursively expand nested objects/arrays
      return acc
    }, {})
  }

  return obj // Return value if not an object/array
}

// Generate a reverse key map from the provided key map
export const generateReverseKeyMap = (keyMap: SomeObj) => Object.fromEntries(Object.entries(keyMap).map(([k, v]) => [v, k]))

export const isDataRetrievalQuery = (query: string) => {
  const cleaned = query
    .replace(/--.*$/gm, "") // remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
    .trim()
    .toLowerCase()

  // if it starts with select, we're done
  if (cleaned.startsWith("select")) return true

  // if it doesn't start with "with", it's not a CTE or select
  if (!cleaned.startsWith("with")) return false

  // find the main statement after the CTE(s)
  // this is a hacky but effective approach using counting parens
  let depth = 0
  let idx = 0
  const len = cleaned.length

  while (idx < len) {
    const char = cleaned[idx]

    if (char === "(") depth++
    else if (char === ")") depth--

    // look for the start of the main statement when depth is 0
    if (depth === 0 && cleaned.slice(idx).match(/^\)\s*(select|insert|update|delete)/)) {
      break
    }

    idx++
  }

  // now extract what's after the last closing ) of the CTE block
  const afterCte = cleaned.slice(idx).replace(/^[)\s]+/, "")

  return afterCte.startsWith("select")
}

export const duckToJsType = (type: string) => {
  const map = new Map([
    ["BOOLEAN", "boolean"],
    ["TINYINT", "integer"],
    ["SMALLINT", "integer"],
    ["INTEGER", "integer"],
    ["BIGINT", "integer"],
    ["UTINYINT", "integer"],
    ["USMALLINT", "integer"],
    ["UINTEGER", "integer"],
    ["UBIGINT", "integer"],
    ["FLOAT", "integer"],
    ["DOUBLE", "integer"],
    ["TIMESTAMP", "date"],
    ["DATE", "date"],
    ["TIME", "date"],
    ["INTERVAL", "string"],
    ["HUGEINT", "integer"],
    ["UHUGEINT", "integer"],
    ["VARCHAR", "string"],
    ["BLOB", "string"],
    ["DECIMAL", "integer"],
    ["TIMESTAMP_S", "date"],
    ["TIMESTAMP_MS", "date"],
    ["TIMESTAMP_NS", "date"],
    ["ENUM", "string"],
    ["LIST", "string"],
    ["STRUCT", "string"],
    ["MAP", "string"],
    ["ARRAY", "string"],
    ["UUID", "string"],
    ["UNION", "string"],
    ["BIT", "integer"],
    ["TIME_TZ", "date"],
    ["TIMESTAMP_TZ", "date"],
    ["ANY", "string"],
    ["VARINT", "integer"],
    ["SQLNULL", null],
  ])
  return map.get(type) || "string"
}
