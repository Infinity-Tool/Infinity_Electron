import { InstallMethod } from '../Services/SelectionContext';
import { InstallationFile } from './InstallationFile';
import LocalizationFile from './LocalizationFile';
import RWGMixerFile from './RWGMixerFile';

export interface InstallationRequest {
  baseUrl: string;
  modsDirectory: string;
  localPrefabsDirectory: string;
  files: InstallationFile[];
  installMethod: InstallMethod;
  localizationFiles: LocalizationFile[];
  rwgMixerFiles: RWGMixerFile[];
  teragon: {
    townPropertyList: string;
    poiPropertyList: string;
  } | null;
}
