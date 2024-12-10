import React, { useEffect } from 'react';
import { Map } from 'ol';
import { makeStyles } from '@mui/styles';
import { Badge, ToggleButtonGroup, } from '@mui/material';
import MuiToggleButton from '@mui/material/ToggleButton'
import { styled } from "@mui/material/styles";
import { observer } from 'mobx-react-lite';
import { useStore } from '../UseStore';

interface MapToolsProps {
  map: Map;
}

const useStyles = makeStyles(() => ({
  button: {
    top: '15px',
    right: '15px',
    zIndex: 1,
    backgroundColor: '#FFFFFF80',
    backdropFilter: 'blur(2px)'
  },
}));

const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: '#404040A0'
  }
});

const MapTools: React.FC<MapToolsProps> = observer(({ map }) => {
  const classes = useStyles();
  const store = useStore();

  useEffect(() => {
    const nextTool = store.currentTool!;
    map.getInteractions().clear();
    nextTool.interactions.forEach(interaction => map?.addInteraction(interaction));
    return () => {
      map.getInteractions().clear();
    };
  }, [map, store.currentTool]);

  useEffect(() => {
    store.currentTool!.setYear(store.year);
  }, [store.year, store.currentTool, store.tools])

  /*const customizations = store.customizations.slice();

  useEffect(() => {
    const roadCustomizationsTool = store.getTool("RoadCustomizations");
    if(store.currentTool?.id != roadCustomizationsTool?.id)
      roadCustomizationsTool!.refresh();
  }, [store, customizations])*/

  const handleChange = (nextToolId: string) => {
    store.switchTool(nextToolId, null);
  };

  if (store.currentTool == null)
    return undefined;

  return (
    <ToggleButtonGroup
      orientation="vertical"
      value={store.currentTool.id}
      exclusive
      onChange={(_event: React.MouseEvent<HTMLElement>, nextToolId: string) => { handleChange(nextToolId) }}
      className={classes.button}
      style={{ position: 'fixed' }}
    >
      {store.tools && store.tools.map((tool, index) => (
        <ToggleButton key={index} value={tool.id} >
          <Badge color="warning" variant="dot" invisible={tool.isEmpty() || tool.year == store.year}>
            <tool.icon />
          </Badge>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
});

export default MapTools;