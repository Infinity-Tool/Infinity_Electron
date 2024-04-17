export default class LocalizationFile {
  source: string;
  destination: string;

  constructor(source: string, destination: string) {
    this.source = source;
    this.destination = destination;
  }
}
