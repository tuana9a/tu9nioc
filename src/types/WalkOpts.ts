interface WalkOpts {
  absolute?: boolean;
  fileNameFilter?(fileName: string): boolean;
  dirNameFilter?(dirName: string): boolean;
}

export default WalkOpts;
