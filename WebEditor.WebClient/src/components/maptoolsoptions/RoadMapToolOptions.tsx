import React from 'react';
import { MenuItem, Select, Box, SelectChangeEvent, Typography, Avatar, CircularProgress } from '@mui/material';
import NewRoadOptions from './NewRoadOptions';
import ModifyRoadOptions from './ModifyRoadOptions';
import RemoveRoadOptions from './RemoveRoadOptions';
import { RoadCustomizationType } from '../../model/RoadCustomization';
import { observer } from 'mobx-react-lite';
import RoadMapTool from '../maptools/RoadMapTool';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import RemoveRoadIcon from '@mui/icons-material/RemoveRoad';
import { styled } from '@mui/material/styles';
import { runInAction } from 'mobx';

const RoadMapToolOptions: React.FC<{ tool: RoadMapTool }> = observer(({ tool }) => {
    const roadCustomization = tool.roadCustomization;

    const handleChange = (event: SelectChangeEvent) => {
        const valueAsString = event.target.value as string;
        const type = RoadCustomizationType[valueAsString as keyof typeof RoadCustomizationType];
        const oldType = roadCustomization.type;
        roadCustomization.setType(type);
      
        let name = "";

        if (oldType == RoadCustomizationType.NEW)
            name = roadCustomization.newRoad.name;
        else if (oldType == RoadCustomizationType.MODIFY)
            name = roadCustomization.modifyRoad.name;
        else
            name = roadCustomization.removeRoad.name;

        runInAction(() => {
            if (type == RoadCustomizationType.NEW)
                roadCustomization.newRoad.name = name;
            else if (type == RoadCustomizationType.MODIFY)
                roadCustomization.modifyRoad.name = name;
            else
                roadCustomization.removeRoad.name = name;
        });

        tool.refresh(true);
    };

    const renderForm = () => {
        switch (roadCustomization.type) {
            case RoadCustomizationType.NEW:
                return <NewRoadOptions tool={tool} />;
            case RoadCustomizationType.MODIFY:
                return <ModifyRoadOptions tool={tool} />;
            case RoadCustomizationType.REMOVE:
                return <RemoveRoadOptions tool={tool} />;
            default:
                return null;
        }
    };

    const Value = (type: RoadCustomizationType) => {
        switch (type) {
            case RoadCustomizationType.NEW:
                return "NEW";
            case RoadCustomizationType.MODIFY:
                return "MODIFY";
            case RoadCustomizationType.REMOVE:
                return "REMOVE";
            default:
                return "";
        }
    };


    const SmallAvatar = styled(Avatar)(() => ({
        width: 24,
        height: 24,
        color: "white",
        backgroundColor: "#AAAAAA"
    }));

    return (
        <>
            <Box sx={{ display: "block", m: 0, p: 0, width: `calc(100%)` }}>
                <Select
                    value={Value(roadCustomization.type)}
                    onChange={handleChange}
                    fullWidth
                    sx={{ p: 0, m: 0, bgcolor: '#FFFFFFAA' }}
                >
                    <MenuItem value={Value(RoadCustomizationType.NEW)} sx={{ p: 1 }}>
                        <Box display="flex" alignItems="center">
                            <SmallAvatar variant="circular"><AddRoadIcon /></SmallAvatar>
                            {tool.loading && <CircularProgress size="28px" sx={{ position: 'absolute', top: '15px', left: '12px', zIndex: 1 }} />}
                            <Typography variant="body1" sx={{ textAlign: "center", marginLeft: 1 }}>Nytt vägsegment</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem value={Value(RoadCustomizationType.MODIFY)} sx={{ p: 1 }}>
                        <Box display="flex" alignItems="center">
                            <SmallAvatar variant="circular"><EditRoadIcon /></SmallAvatar>
                            <Typography variant="body1" sx={{ textAlign: "center", marginLeft: 1 }}>Ändra vägsegment</Typography>
                            {tool.loading && <CircularProgress size="28px" sx={{ position: 'absolute', top: '15px', left: '12px', zIndex: 1 }} />}
                        </Box>
                    </MenuItem>
                    <MenuItem value={Value(RoadCustomizationType.REMOVE)} sx={{ p: 1 }}>
                        <Box display="flex" alignItems="center">
                            <SmallAvatar variant="circular"><RemoveRoadIcon /></SmallAvatar>
                            <Typography variant="body1" sx={{ textAlign: "center", marginLeft: 1 }}>Tabort vägsegment</Typography>
                            {tool.loading && <CircularProgress size="28px" sx={{ position: 'absolute', top: '15px', left: '12px', zIndex: 1 }} />}
                        </Box>
                    </MenuItem>
                </Select>
            </Box>
            <Box sx={{ display: "block", m: 0, p: 0, width: `calc(100%)`, overflow: 'auto' }}>
                {renderForm()}
            </Box>
        </>
    );
});

export default RoadMapToolOptions;
