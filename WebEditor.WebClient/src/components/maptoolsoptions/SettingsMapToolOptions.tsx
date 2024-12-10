import React from 'react';
import { FormControlLabel, Checkbox, FormGroup, Box, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import SettingsMapTool from '../maptools/SettingsMapTool';
import { RoadCustomizationStorageDTO } from '../../model/RoadCustomizationDTO';
import { useStore } from '../../UseStore';

const SettingsMapToolOptions: React.FC<{ tool: SettingsMapTool }> = observer(({ tool }) => {
    const store = useStore();
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [mapVisible, setMapVisible] = React.useState(tool.mapLayer.getVisible());
    const [roadVisible, setRoadVisible] = React.useState(tool.roadLayer.getVisible());


    const mapVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        tool.mapLayer.setVisible(checked);
        setMapVisible(checked);
    };

    const roadVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        tool.roadLayer.setVisible(checked);
        setRoadVisible(checked);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const project: RoadCustomizationStorageDTO[] = JSON.parse(text);
                store.loadProject(project);
            };
            reader.readAsText(file);
        }
    };

    const loadProject = () => {
        fileInputRef.current?.click();
    };

    const saveProject = () => {
        store.saveProject();
    };

    const newProject = () => {
        store.newProject();
    }

    return (
        <Box sx={{ display: "block", m: 0, p: 0, width: `calc(100%)`, overflow: 'auto' }}>
            <FormGroup sx={{ m: 0, p: 2, bgcolor: "#00000000", gap: 1 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={mapVisible}
                            onChange={mapVisibleChange}
                            size="small"
                            name="mapLayerVisible"
                            sx={{ m: 0, pl: 1, pt: 0, pb: 0 }}
                        />
                    }
                    label="Visa bakgrundskarta"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={roadVisible}
                            onChange={roadVisibleChange}
                            size="small"
                            name="roadLayerVisible"
                            sx={{ m: 0, pl: 1, pt: 0, pb: 0 }}
                        />
                    }
                    label="Visa väg"
                />
                <Box sx={{ m: 2, p: 0, display: 'contents', justifyContent: "space-between" }}>
                    <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} />
                    <Button variant="contained" onClick={newProject} >
                        Nytt projekt
                    </Button>
                    <Button variant="contained" onClick={loadProject} >
                        Läs in projekt
                    </Button>
                    <Button variant="contained" onClick={saveProject}>
                        Spara projekt
                    </Button>
                </Box>
            </FormGroup>
        </Box>
    );
});

export default SettingsMapToolOptions;
