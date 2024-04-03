export default class PoiItem {
  public parent: string;
  public name: string;
  public description: string | null;
  public images: any[] | null;
  public editorGroups: any[] | null;
  public tags: string[] | null;
  public themeTags: string[] | null;
  public themeRepeatDistance: string | null;
  public duplicateRepeatDistance: string | null;
  public sleeperMin: string | null;
  public sleeperMax: string | null;
  public prefabSize: string | null;
  public conflictKey: string | null;

  public constructor(
    parent: string,
    name: string,
    description: string | null,
    images: any[] | null,
    editorGroups: any[] | null,
    tags: string[] | null,
    themeTags: string[] | null,
    themeRepeatDistance: string | null,
    duplicateRepeatDistance: string | null,
    sleeperMin: string | null,
    sleeperMax: string | null,
    prefabSize: string | null,
    conflictKey: string | null,
  ) {
    this.parent = parent;
    this.name = name;
    this.description = description;
    this.images = images;
    this.editorGroups = editorGroups;
    this.tags = tags;
    this.themeTags = themeTags;
    this.themeRepeatDistance = themeRepeatDistance;
    this.duplicateRepeatDistance = duplicateRepeatDistance;
    this.sleeperMin = sleeperMin;
    this.sleeperMax = sleeperMax;
    this.prefabSize = prefabSize;
    this.conflictKey = conflictKey;
  }
}
