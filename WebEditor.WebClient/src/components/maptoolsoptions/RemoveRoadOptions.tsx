import React from 'react';
import { Button, Box, TextField, FormGroup } from '@mui/material';
import { observer } from 'mobx-react-lite';
import RoadMapTool from '../maptools/RoadMapTool';
import { useStore } from '../../UseStore';
import { RoadCustomization, RoadCustomizationType } from '../../model/RoadCustomization';

const RemoveRoadOptions: React.FC<{ tool: RoadMapTool }> = observer(({ tool }) => {
    const store = useStore();
    const removeRoad = tool.roadCustomization.removeRoad;

    const save = () => {
        store.addCustomization(tool.roadCustomization);
        const customization = new RoadCustomization();
        customization.type = RoadCustomizationType.REMOVE;
        tool.setRoadCustomization(customization);
        tool.clear();
    };

    const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        removeRoad.setAttribute(name, value);
    };

    const isFormComplete = () => {
        return tool.roadCustomization.preview &&
            tool.roadCustomization.preview.getLength() > 0 && 
            tool.roadCustomization.removeRoad.name.length <= 12;
    };


    return (
        <FormGroup sx={{ m: 0, p: 2, bgcolor: "#00000000", gap: 1 }}>
            <TextField
                label="Segmentnamn"
                name="name"
                variant="outlined"
                size="small"
                value={removeRoad.name}
                error={removeRoad.name.length > 12}
                onChange={handleText}
                sx={{ bgcolor: '#FFFFFF' }}
            />
            <Box sx={{ mt: 1, p: 0, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" disabled={!isFormComplete()} onClick={save}>
                    Spara
                </Button>
            </Box>
        </FormGroup>
    );
});

export default RemoveRoadOptions;
