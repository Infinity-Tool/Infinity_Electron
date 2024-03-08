import { InstallMethod } from '../Services/SelectionContext';
import { InstallationFile } from './InstallationFile';

export interface InstallationRequest {
  modsDirectory: string;
  localPrefabsDirectory: string;
  files: InstallationFile[];
  installMethod: InstallMethod;
  teragon: {
    townPropertyList: string;
    poiPropertyList: string;
  } | null;
}
