import { Box, Paper } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { observer } from 'mobx-react-lite';
import { useStore } from '../UseStore';

const useStyles = makeStyles(() => ({
  container: {
    top: '15px',
    left: '15px',
    backgroundColor: '#FFFFFF88',
    backdropFilter: 'blur(3px)',
    color: "#000000FF"
  },
}));

const MapToolOptions: React.FC = observer(() => {
  const classes = useStyles();
  const { currentTool } = useStore();

  if (!currentTool || !currentTool.hasOptions()) {
    return (undefined);
  }

  return (
    <Paper elevation={5} sx={{ backgroundColor: '#FFFFFF88' }} className={classes.container} style={{ position: 'fixed', width: '350px', padding: 0, margin: 0 }}>
      <Box sx={{ maxHeight: `calc(100vh - 30px)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {currentTool.options}
      </Box>
    </Paper>
  );
});

export default MapToolOptions;
