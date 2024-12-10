import React from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, FormGroup, Paper, FormHelperText } from '@mui/material';
import { observer } from 'mobx-react-lite';
import RoadMapTool from '../maptools/RoadMapTool';
import { formatDistance } from '../../util/string';
import { useStore } from '../../UseStore';
import { RoadCustomization, RoadCustomizationType } from '../../model/RoadCustomization';
import NumberField from '../NumberField';

const ModifyRoadOptions: React.FC<{ tool: RoadMapTool }> = observer(({ tool }) => {
    const store = useStore();
    const modifyRoad = tool.roadCustomization.modifyRoad;

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        modifyRoad.setAttribute(name, checked);
        if (name == "snapStart" || name == "snapEnd")
            tool.refresh();
    };

    const handleNumber = (name: string, value: number) => {
        modifyRoad.setAttribute(name, value);
    };

    const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        modifyRoad.setAttribute(name, value);
    };

    const save = () => {
        store.addCustomization(tool.roadCustomization);
        const customization = new RoadCustomization();
        customization.type = RoadCustomizationType.MODIFY;
        tool.setRoadCustomization(customization);
        tool.clear();
    };

    const isFormComplete = () => {
        return tool.roadCustomization.startConnection != null &&
            tool.roadCustomization.startConnection.hasResult &&
            tool.roadCustomization.preview &&
            tool.roadCustomization.preview.getLength() > 0 &&
            modifyRoad.forwardSpeed >= 1 &&
            modifyRoad.backwardSpeed >= 1 &&
            modifyRoad.forwardSpeed <= 160 &&
            modifyRoad.backwardSpeed <= 160 &&
            modifyRoad.roadClass <= 9 &&
            modifyRoad.name.length <= 12;
    };

    return (
        <FormGroup sx={{ m: 0, p: 2, bgcolor: "#00000000", gap: 1 }}>
            <TextField
                label="Segmentnamn"
                name="name"
                variant="outlined"
                size="small"
                value={modifyRoad.name}
                error={modifyRoad.name.length > 12}
                onChange={handleText}
                sx={{ bgcolor: '#FFFFFF' }}
            />
            <NumberField
                label="Hastighet framåt"
                name="forwardSpeed"
                variant="outlined"
                size="small"
                value={modifyRoad.forwardSpeed}
                onChange={handleNumber}
                sx={{ bgcolor: '#FFFFFF' }}
                min={1}
                max={160}
            />
            <NumberField
                label="Hastighet bakåt"
                name="backwardSpeed"
                variant="outlined"
                size="small"
                value={modifyRoad.backwardSpeed}
                onChange={handleNumber}
                sx={{ bgcolor: '#FFFFFF' }}
                min={1}
                max={160}
            />

            <Paper elevation={1} sx={{ display: "grid", m: 0, p: 1 }}>
                <NumberField
                    label="Vägklass"
                    name="roadClass"
                    variant="outlined"
                    size="small"
                    value={modifyRoad.roadClass}
                    onChange={handleNumber}
                    sx={{ bgcolor: '#FFFFFF' }}
                    min={0}
                    max={9}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={modifyRoad.isFerry}
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
                            checked={modifyRoad.isMotorway}
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
                            checked={modifyRoad.forwardProhibited}
                            onChange={handleCheckbox}
                            size="small"
                            name="forwardProhibited"
                        />
                    }
                    label="Förbjuden färdriktning framåt."
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={modifyRoad.backwardProhibited}
                            onChange={handleCheckbox}
                            size="small"
                            name="backwardProhibited"
                        />
                    }
                    label="Förbjuden färdriktning bakåt."
                />
                <FormHelperText>
                    Väglängd {tool.roadCustomization.preview && formatDistance(tool.roadCustomization.preview.getLength())}
                </FormHelperText>
            </Paper>
            <Box sx={{ mt: 1, p: 0, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" disabled={!isFormComplete()} onClick={save}>
                    Spara
                </Button>
            </Box>
        </FormGroup>
    );
});

export default ModifyRoadOptions;
