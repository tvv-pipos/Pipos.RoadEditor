import Interaction from "ol/interaction/Interaction";
import { SvgIconComponent } from '@mui/icons-material';
import { RoadCustomization } from "./RoadCustomization";

export default interface MapTool
{
    id: string;
    interactions: Interaction[];
    icon: SvgIconComponent;
    options: JSX.Element;
    year: number;
    setYear: (year: number) => void;
    load: (arg: RoadCustomization | null) => void;
    unLoad: () => void;
    isEmpty: () => boolean;
    hasOptions:() => boolean;
    isSelectionTool: () => boolean; 
    refresh: () => void;
}