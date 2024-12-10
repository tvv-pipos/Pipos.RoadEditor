import { List, ListItem, ListItemText, Paper } from '@mui/material';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { formatBoolean, formatDistance } from '../../util/string';
import SelectEdgeMapTool from '../maptools/SelectEdgeMapTool';


const SelectEdgeMapToolOptions: React.FC<{ tool: SelectEdgeMapTool }> = observer(({ tool }) => {

    return (
        <>
            {tool.selectedEdge &&
                <Paper elevation={1} sx={{ m: 2, p: 0, width: `calc(100% - 2em)`, overflow: 'auto' }}>
                    <List dense={true} sx={{ p: 0 }}>
                        <ListItem>
                            <ListItemText primary="Väglängd" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={formatDistance(tool.selectedEdge.distance)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Hastighet framåt" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={tool.selectedEdge.forwardSpeed + " km/h"} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Hastighet bakåt" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={tool.selectedEdge.backwardSpeed + " km/h"} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="År" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={tool.selectedEdge.years.map(year => year.toString().slice(-2)).join(', ')} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Vägklass" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={tool.selectedEdge.attribute.class} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Färjeled" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={formatBoolean(tool.selectedEdge.attribute.ferry)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Förbjuden färdriktning framåt" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={formatBoolean(tool.selectedEdge.attribute.forwardProhibited)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Förbjuden färdriktning bakåt" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={formatBoolean(tool.selectedEdge.attribute.backwardProhibited)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Motorväg" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={formatBoolean(tool.selectedEdge.attribute.motorway)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Frånkoplad" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={formatBoolean(tool.selectedEdge.attribute.disconnectedIsland)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Geometrilängd" aria-expanded="true" />
                            <ListItemText sx={{ textAlign: "right" }} primary={formatDistance(tool.selectedEdge.segments.getLength())} />
                        </ListItem>
                    </List>
                </Paper>
            }
        </>
    );
});

export default SelectEdgeMapToolOptions;
