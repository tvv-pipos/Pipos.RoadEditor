import React from 'react';
import { observer } from 'mobx-react-lite';
import { Avatar, Box, Button, CircularProgress, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, styled } from '@mui/material';
import { useStore } from '../../UseStore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import RemoveRoadIcon from '@mui/icons-material/RemoveRoad';
import { RoadCustomization, RoadCustomizationType } from '../../model/RoadCustomization';
import RoadCustomizationsMapTool from '../maptools/RoadCustomizationsMapTool';
import { RoadCustomizationDTO } from '../../model/RoadCustomizationDTO';

const RoadCustomizationOptions: React.FC<{ tool: RoadCustomizationsMapTool }> = observer(({ tool }) => {
    const store = useStore();

    const getIcon = (type: RoadCustomizationType) => {
        switch (type) {
            case RoadCustomizationType.NEW:
                return <AddRoadIcon />;
            case RoadCustomizationType.MODIFY:
                return <EditRoadIcon />;
            case RoadCustomizationType.REMOVE:
                return <RemoveRoadIcon />;
            default:
                return null;
        }
    };

    const getName = (road: RoadCustomization) => {
        switch (road.type) {
            case RoadCustomizationType.NEW:
                return road.newRoad.name;
            case RoadCustomizationType.MODIFY:
                return road.modifyRoad.name;
            case RoadCustomizationType.REMOVE:
                return road.removeRoad.name;
        }
    }

    const removeCustomization = (event: React.MouseEvent<HTMLElement>, id: number) => {
        event.stopPropagation();
        store.removeCustomization(id);
        tool.refresh();
    };

    const editCustomization = (event: React.MouseEvent<HTMLElement>, id: number) => {
        event.stopPropagation();
        tool.select(null);
        const customization = store.customizations[id];
        store.removeCustomization(id);
        store.switchTool("Road", customization);
    };

    const SmallAvatar = styled(Avatar)(() => ({
        width: 32,
        height: 32,
        color: "white",
        backgroundColor: "#AAAAAA"
    }));

    const select = (id: number) => {
        tool.select(id);
    }

    const zoomIn = () => {
        tool.zoomInOnCustomizations();
    }

    const getSxStyles = (isSelected: boolean) => ({
        backgroundColor: isSelected ? 'primary.main' : 'inherit',
        color: isSelected ? 'white' : 'inherit',
        '&:hover': { backgroundColor: isSelected ? 'primary.dark' : 'grey.300', },
    });

    const save = () => {
        const customizarionDTO: RoadCustomizationDTO[] = [];
        store.customizations.forEach(item => customizarionDTO.push(item.toDTO()));
        const jsonStr = JSON.stringify(customizarionDTO);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AnpassatVägnät_${store.year}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <Paper elevation={1} sx={{ display: "grid", mt: 2, p: 0, width: `calc(100% - 2em)`, overflowY: 'auto' }}>
                <List sx={{ ml: 1, mr: 1 }}>
                    {store.customizations.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <ListItem sx={getSxStyles(tool.selectedId === item.id)} onClick={() => select(item.id)}>
                                <ListItemAvatar>
                                    <SmallAvatar variant='circular'>{getIcon(item.type)}</SmallAvatar>
                                    {tool.loading == index && <CircularProgress size="36px" sx={{position: 'absolute', top: '10px', left: '14px', zIndex: 1 }}/> }
                                </ListItemAvatar>
                                <ListItemText primary={getName(item)} />
                                <IconButton edge="end" aria-label="edit" onClick={(event) => editCustomization(event, item.id)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={(event) => removeCustomization(event, item.id)}>
                                    <DeleteIcon />
                                </IconButton>   
                            </ListItem>
                            {index < store.customizations.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Box sx={{ m: 2, p: 0, display: 'flex', justifyContent: "space-between",  width: `calc(100% - 2em)` }}>
                <Button variant="contained" onClick={zoomIn}>
                    Zooma in
                </Button>
                <Button variant="contained" onClick={save}>
                    Spara
                </Button>
            </Box>
        </>
    );
});

export default RoadCustomizationOptions;
