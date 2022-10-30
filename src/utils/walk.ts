import fs from "fs";
import path from "path";
import WalkOpts from "src/types/WalkOpts";

export default function walk(dir: string, opts: WalkOpts) {
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