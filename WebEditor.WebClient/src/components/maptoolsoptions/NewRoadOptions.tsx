import React from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, FormGroup, Paper, FormHelperText } from '@mui/material';
import { observer } from 'mobx-react-lite';
import RoadMapTool from '../maptools/RoadMapTool';
import { useStore } from '../../UseStore';
import { RoadCustomization, RoadCustomizationType } from '../../model/RoadCustomization';
import NumberField from '../NumberField';

const NewRoadOptions: React.FC<{ tool: RoadMapTool }> = observer(({ tool }) => {
    const store = useStore();
    let newRoad = tool.roadCustomization.newRoad;

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        tool.roadCustomization.newRoad.setAttribute(name, checked);
        if (name == "snapStart" || name == "snapEnd")
            tool.refresh();
    };

    const handleNumber = (name: string, value: number) => {
        tool.roadCustomization.newRoad.setAttribute(name, value);
    };

    const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        tool.roadCustomization.newRoad.setAttribute(name, value);
    };

    const isFormComplete = () => {
        return (!newRoad.snapStart || (tool.roadCustomization.startConnection != null && tool.roadCustomization.startConnection.hasResult)) &&
            (!newRoad.snapEnd || (tool.roadCustomization.endConnection != null && tool.roadCustomization.endConnection.hasResult)) &&
            tool.roadCustomization.preview &&
            tool.roadCustomization.preview.getLength() > 0 &&
            newRoad.distance > 0 &&
            newRoad.forwardSpeed > 0 &&
            newRoad.backwardSpeed > 0 &&
            newRoad.forwardSpeed <= 160 &&
            newRoad.backwardSpeed <= 160 &&
            newRoad.roadClass <= 9 && 
            newRoad.name.length <= 12;
    };

    const save = () => {
        store.addCustomization(tool.roadCustomization);
        const customization = new RoadCustomization();
        customization.type = RoadCustomizationType.NEW;
        newRoad = tool.roadCustomization.newRoad;
        tool.setRoadCustomization(customization);
        tool.clear();
    };

    return (
        <FormGroup sx={{ m: 0, p: 2, bgcolor: "#00000000", gap: 1 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={newRoad.snapStart}
                        onChange={handleCheckbox}
                        size="small"
                        name="snapStart"
                        sx={{ m: 0, pl: 1, pt: 0, pb: 0 }}
                    />
                }
                label="Anslut startnod"
            />
            <FormHelperText style={{ color: 'red' }}>
                {newRoad.snapStart && (tool.roadCustomization.startConnection != null && !tool.roadCustomization.startConnection.hasResult) ? 'Går inte att ansluta, flytta noden närmare' : ''}
            </FormHelperText>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={newRoad.snapEnd}
                        onChange={handleCheckbox}
                        size="small"
                        name="snapEnd"
                        sx={{ m: 0, pl: 1, pt: 0, pb: 0 }}
                    />
                }
                label="Anslut målnod"
            />
            <FormHelperText style={{ color: 'red' }}>
                {newRoad.snapEnd && (tool.roadCustomization.endConnection != null && !tool.roadCustomization.endConnection.hasResult) ? 'Går inte att ansluta, flytta noden närmare' : ''}
            </FormHelperText>
            <TextField
                label="Segmentnamn"
                name="name"
                variant="outlined"
                size="small"
                value={newRoad.name}
                error={newRoad.name.length > 12}
                onChange={handleText}
                sx={{ bgcolor: '#FFFFFF' }}
            />
            <NumberField
                label="Väglängd"
                name="distance"
                variant="outlined"
                size="small"
                value={newRoad.distance}
                min={1}
                onChange={handleNumber}
                sx={{ bgcolor: '#FFFFFF' }}
            />
            <NumberField
                label="Hastighet framåt"
                name="forwardSpeed"
                variant="outlined"
                size="small"
                value={newRoad.forwardSpeed}
                onChange={handleNumber}
                min={1}
                max={160}
                sx={{ bgcolor: '#FFFFFF' }}
            />
            <NumberField
                label="Hastighet bakåt"
                name="backwardSpeed"
                variant="outlined"
                size="small"
                value={newRoad.backwardSpeed}
                onChange={handleNumber}
                min={1}
                max={160}
                sx={{ bgcolor: '#FFFFFF' }}
            />

            <Paper elevation={1} sx={{ display: "grid", m: 0, p: 1 }}>
                <NumberField
                    label="Vägklass"
                    name="roadClass"
                    variant="outlined"
                    size="small"
                    value={newRoad.roadClass}
                    min={0}
                    max={9}
                    onChange={handleNumber}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newRoad.isFerry}
                            onChange={handleCheckbox}
                            size="small"
                            name="isFerry"
                        />
                    }
                    label="Färjeled"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newRoad.isMotorway}
                            onChange={handleCheckbox}
                            size="small"
                            name="isMotorway"
                        />
                    }
                    label="Motorväg"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newRoad.forwardProhibited}
                            onChange={handleCheckbox}
                            size="small"
                            name="forwardProhibited"
                        />
                    }
                    label="Förbjuden färdriktning framåt"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newRoad.backwardProhibited}
                            onChange={handleCheckbox}
                            size="small"
                            name="backwardProhibited"
                        />
                    }
                    label="Förbjuden färdriktning bakåt"
                />
            </Paper>
            <Box sx={{ mt: 1, p: 0, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" disabled={!isFormComplete()} onClick={save}>
                    Spara
                </Button>
            </Box>
        </FormGroup>
    );
});

export default NewRoadOptions;
