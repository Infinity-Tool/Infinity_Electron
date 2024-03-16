import { Context, createContext, useContext } from 'react';
import StorageKeys from './StorageKeys';
import useLocalStorage from './useLocalStorage';

export enum InstallMethod {
  overwrite = 'overwrite',
  cleanInstall = 'cleanInstall',
  quickInstall = 'missingFilesOnly',
}
export class Selection {
  public installMethod: InstallMethod = InstallMethod.cleanInstall;
  public setInstallMethod: any;

  public moddedInstall: boolean = true;
  public setModdedInstall: any;

  public modsDirectory: string | null = null;
  public setModsDirectory: any;

  public localPrefabsDirectory: string | null = null;
  public setLocalPrefabsDirectory: any;

  public step1Selection: any[] = [];
  public setStep1Selection: any;

  public step2Selection: any[] = [];
  public setStep2Selection: any;

  public step2SelectedTags: any[] = [];
  public setStep2SelectedTags: any;

  public step3Selection: any[] = [];
  public setStep3Selection: any;

  public step4Selection: any[] = [];
  public setStep4Selection: any;

  public step4SelectedTags: any[] = [];
  public setStep4SelectedTags: any;

  public step5Selection: any[] = [];
  public setStep5Selection: any;

  public excludeTraders: boolean = false;
  public setExcludeTraders: any;

  public buildTeragonFiles: boolean = false;
  public setBuildTeragonFiles: any;
}

export const selectionContext = createContext(new Selection());

export const useSelectionContext = () => {
  const context = useContext<Selection>(selectionContext as Context<Selection>);

  if (!context) {
    throw new Error(
      'useSelectionContext must be used within a SelectionProvider',
    );
  }

  return context;
};

export const SelectionContextProvider = ({ children }: any): any => {
  const [installMethod, setInstallMethod] = useLocalStorage(
    StorageKeys.installMethod,
    InstallMethod.overwrite,
  );
  const [moddedInstall, setModdedInstall] = useLocalStorage(
    StorageKeys.moddedInstall,
    false,
  );
  const [modsDirectory, setModsDirectory] = useLocalStorage(
    StorageKeys.modsDirectory,
    '',
  );
  const [localPrefabsDirectory, setLocalPrefabsDirectory] = useLocalStorage(
    StorageKeys.localPrefabsDirectory,
    '',
  );
  const [step1Selection, setStep1Selection] = useLocalStorage(
    StorageKeys.step1Selection,
    [],
  );
  const [step2Selection, setStep2Selection] = useLocalStorage(
    StorageKeys.step2Selection,
    [],
  );
  const [step2SelectedTags, setStep2SelectedTags] = useLocalStorage(
    StorageKeys.step2SelectedTags,
    [],
  );
  const [step3Selection, setStep3Selection] = useLocalStorage(
    StorageKeys.step3Selection,
    [],
  );
  const [step4Selection, setStep4Selection] = useLocalStorage(
    StorageKeys.step4Selection,
    [],
  );
  const [step4SelectedTags, setStep4SelectedTags] = useLocalStorage(
    StorageKeys.step4SelectedTags,
    [],
  );
  const [step5Selection, setStep5Selection] = useLocalStorage(
    StorageKeys.step5Selection,
    [],
  );
  const [excludeTraders, setExcludeTraders] = useLocalStorage(
    StorageKeys.excludeTraders,
    false,
  );

  const [buildTerragonFiles, setBuildTerragonFiles] = useLocalStorage(
    StorageKeys.buildTerragonFiles,
    false,
  );

  const selection: Selection = {
    installMethod,
    setInstallMethod,
    moddedInstall,
    setModdedInstall,
    modsDirectory,
    setModsDirectory,
    localPrefabsDirectory,
    setLocalPrefabsDirectory,
    step1Selection,
    setStep1Selection,
    step2Selection,
    setStep2Selection,
    step2SelectedTags: step2SelectedTags,
    setStep2SelectedTags: setStep2SelectedTags,
    step3Selection,
    setStep3Selection,
    step4Selection,
    setStep4Selection,
    step4SelectedTags: step4SelectedTags,
    setStep4SelectedTags: setStep4SelectedTags,
    step5Selection,
    setStep5Selection,
    excludeTraders,
    setExcludeTraders,
    buildTeragonFiles: buildTerragonFiles,
    setBuildTeragonFiles: setBuildTerragonFiles,
  };

  return (
    <selectionContext.Provider value={selection}>
      {children}
    </selectionContext.Provider>
  );
};
