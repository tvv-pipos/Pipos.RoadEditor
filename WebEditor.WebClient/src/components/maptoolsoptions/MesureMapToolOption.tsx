import { Box, Checkbox, FormControlLabel, FormGroup, LinearProgress, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { observer } from 'mobx-react-lite';
import MesureMapTool from '../maptools/MesureMapTool';
import { formatDistance, formatTime, toStr } from '../../util/string';

const useStyles = makeStyles(() => ({
    colorLabel: {
        display: 'flex',
        alignItems: 'center',
    },
    colorBox: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
    },

}));

const MesureMapToolOptions: React.FC<{ tool: MesureMapTool }> = observer(({ tool }) => {
    const classes = useStyles();

    return (
        <Box sx={{ display: "block", m: 0, p: 0, width: `calc(100%)`, overflow: 'auto' }}>
            <FormGroup sx={{ m: 0, p: 1, bgcolor: "#00000000" }}>
                <FormControlLabel sx={{ m: 0, p: 0 }} control={
                    <Checkbox checked={tool.allowBidirectionalTravel} onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => tool.setAllowBidirectionalTravel(checked)} />
                } label="Tillåt tvåvägsfärd" />
                <FormControlLabel sx={{ m: 0, p: 0 }} control={
                    <Checkbox checked={tool.includeConnectionDistrance} onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => tool.setIncludeConnectionDistance(checked)} />
                } label="Inkludera anslutning" />
                <TextField
                    label="Max anslutningsavstånd"
                    error={tool.maxConnectionDistanceError}
                    variant="outlined"
                    size="small"
                    value={toStr(tool.maxConnectionDistance)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => tool.setMaxConnectionDistance(parseInt(event.target.value))}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    sx={{ m: 1, p: 0, bgcolor: '#FFFFFF' }}
                />
                <TextField
                    label="Anslutningshastighet"
                    error={tool.connectionSpeedError}
                    variant="outlined"
                    size="small"
                    value={toStr(tool.connectionSpeed)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => tool.setConnectionSpeed(parseFloat(event.target.value))}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    sx={{ m: 1, p: 0, bgcolor: '#FFFFFF' }}
                />
            </FormGroup>
            {tool.loading && <LinearProgress /> }
            {tool.shortestPath &&
                <>
                    <Box sx={{ ml: 2, mb: 1 }} className={classes.colorLabel}>
                        <Box className={classes.colorBox} sx={{ backgroundColor: '#008000' }} />
                        <Typography textAlign={"center"} sx={{ ml: 1 }}>Kortastevägen</Typography>
                    </Box>
                    <Paper elevation={1} sx={{ ml: 2, mr: 2, marginBottom: 2, p: 0, bgcolor: '#FFFFFF' }}>
                        <List dense={true} sx={{ p: 0 }}>
                            <ListItem>
                                <ListItemText primary="Tid" aria-expanded="true" />
                                <ListItemText sx={{ textAlign: "right" }} primary={formatTime(tool.shortestPath.time)} />
                            </ListItem>                        <ListItem>
                                <ListItemText primary="Avstånd" aria-expanded="true" />
                                <ListItemText sx={{ textAlign: "right" }} primary={formatDistance(tool.shortestPath.distance)} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Geometrilängd" aria-expanded="true" />
                                <ListItemText sx={{ textAlign: "right" }} primary={formatDistance(tool.shortestPath.lineString.getLength())} />
                            </ListItem>
                        </List>
                    </Paper>
                </>
            }
            {tool.fastestPath &&
                <>
                    <Box sx={{ ml: 2, mb: 1 }} className={classes.colorLabel}>
                        <Box className={classes.colorBox} sx={{ backgroundColor: '#FF4500' }} />
                        <Typography textAlign={"center"} sx={{ ml: 1 }}>Snabbastevägen</Typography>
                    </Box>
                    <Paper elevation={1} sx={{ ml: 2, mr: 2, marginBottom: 2, p: 0, bgcolor: '#FFFFFF' }}>
                        <List dense={true} sx={{ p: 0 }}>
                            <ListItem>
                                <ListItemText primary="Tid" aria-expanded="true" />
                                <ListItemText sx={{ textAlign: "right" }} primary={formatTime(tool.fastestPath.time)} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Avstånd" aria-expanded="true" />
                                <ListItemText sx={{ textAlign: "right" }} primary={formatDistance(tool.fastestPath.distance)} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Geometrilängd" aria-expanded="true" />
                                <ListItemText sx={{ textAlign: "right" }} primary={formatDistance(tool.fastestPath.lineString.getLength())} />
                            </ListItem>
                        </List>
                    </Paper>
                </>
            }
        </Box>
    );
});

export default MesureMapToolOptions;
