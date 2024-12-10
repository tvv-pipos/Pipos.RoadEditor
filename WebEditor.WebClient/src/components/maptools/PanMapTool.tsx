import MapTool from "../../model/MapTool";
import { defaults, Interaction } from 'ol/interaction';
import PanToolIcon from '@mui/icons-material/PanTool';
import { SvgIconComponent } from "@mui/icons-material";
import { action, makeAutoObservable } from "mobx";


export class PanMapTool implements MapTool {
    id: string;
    interactions: Interaction[];
    icon: SvgIconComponent;
    options: JSX.Element;
    year: number;

    constructor() {
        this.id = "Pan";
        this.interactions = defaults().getArray();
        this.icon = PanToolIcon;
        this.options = (<div />);
        this.year = 2024;

        makeAutoObservable(this, {
            unLoad: action
        });
    }

    load() {
        
    }

    unLoad() : void {

    }

    setYear(year: number) {
        this.year = year;
    }

    isEmpty() {
        return true;
    }

    isSelectionTool() {
        return false;
    }

    hasOptions() {
        return false;
    }

    refresh() {
        
    }
}

export default PanMapTool;

