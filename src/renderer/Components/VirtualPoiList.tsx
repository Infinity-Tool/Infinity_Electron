import { Virtuoso } from 'react-virtuoso';
import { Divider } from '@mui/material';
import PoiListItem from './PoiListItem';

export default function VirtualTabFileList(props: any) {
  const { tabFiles, selection, onToggle, setInfoDialogState, selectedTags } =
    props;
  const count = tabFiles.length;
  const poiInfoStyles = {
    maxWidth: '66%',
  };

  return (
    <Virtuoso
      style={{
        height: '100%',
      }}
      totalCount={count}
      itemContent={(index) => {
        return (
          <>
            <PoiListItem
              index={index}
              poiInfoStyles={poiInfoStyles}
              selection={selection}
              tabFile={tabFiles[index]}
              onToggle={onToggle}
              setInfoDialogState={setInfoDialogState}
              selectedTags={selectedTags}
            />
            <Divider variant="middle" />
          </>
        );
      }}
    />
  );
}
