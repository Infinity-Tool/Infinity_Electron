interface TabContent {
  tabName: string;
  tabFiles: TabFile[];
  parentName: string | null;
}

interface TabFile {
  parent: string;
  name: string;
  description: string;
  images: string[];
  editorGroups: string[];
}
