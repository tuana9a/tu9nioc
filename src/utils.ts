import fs from "fs";
import path from "path";
import { Klass, WalkOpts } from "./types";
import _ from "lodash";

export function walk(dir: string, opts: WalkOpts) {
  let results: string[] = [];
  const filepaths = fs.readdirSync(dir);

  for (const originFilePath of filepaths) {
    const filepath = opts?.absolute ? path.resolve(dir, originFilePath) : path.join(dir, originFilePath);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      if (opts?.dirNameFilter) {
        if (opts?.dirNameFilter(originFilePath)) {
          const childResults = walk(filepath, opts);
          results = results.concat(childResults);
        }
      } else {
        const childResults = walk(filepath, opts);
        results = results.concat(childResults);
      }
    } else {
      if (opts?.fileNameFilter) {
        if (opts?.fileNameFilter(originFilePath)) {
          results.push(filepath);
        }
      } else {
        results.push(filepath);
      }
    }
  }
  return results;
}

export function createGetterName(propName: string) {
  return "get" + propName.charAt(0).toUpperCase() + propName.slice(1);
}

export function createSetterName(propName: string) {
  return "set" + propName.charAt(0).toUpperCase() + propName.slice(1);
}

export function toCamelCase(name: string | Klass) {
  if ((name as Klass).name) {
    const klassName = (name as Klass).name;
    return _.camelCase(klassName);
  }
  return _.camelCase(name as string);
}