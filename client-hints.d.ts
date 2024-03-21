export default class ClientHints {
  static getHeaderClientHints(): JSONObject;
  static isSupport(headers: JSONObject): boolean;

  parse(hints: JSONObject, meta: JSONObject): JSONObject;
}

export type JSONValue =
  | string
  | number
  | boolean
  | JSONObject
  | JSONArray
  | null;

export interface JSONObject {
  [k: string]: JSONValue;
}
export type JSONArray = Array<JSONValue>;
