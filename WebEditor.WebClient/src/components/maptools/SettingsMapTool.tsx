import MapTool from "../../model/MapTool";
import { DragPan, Interaction, MouseWheelZoom, PinchZoom } from 'ol/interaction';
import { SvgIconComponent } from "@mui/icons-material";
import { action, makeAutoObservable } from "mobx";
import SettingsIcon from '@mui/icons-material/Settings';
import { XYZ } from "ol/source";
import TileLayer from "ol/layer/Tile";
import SettingsMapToolOptions from "../maptoolsoptions/SettingsMapToolOptions";
import { Layer } from "ol/layer";

export class SettingsMapTool implements MapTool {
    id: string;
    interactions: Interaction[];
    icon: SvgIconComponent;
    options: JSX.Element;
    year: number;
    mapLayer: Layer;
    roadLayer: TileLayer<XYZ>;

    constructor(mapLayer: Layer, roadLayer: TileLayer<XYZ>) {        
        this.id = "Settings";
        this.interactions = [new PinchZoom(), new DragPan({ condition: function(event) { return event.originalEvent && event.originalEvent.button === 1; }}), new MouseWheelZoom()];       
        this.icon = SettingsIcon;
        this.options = (<SettingsMapToolOptions tool={this} />);
        this.year = 2024;
        this.mapLayer = mapLayer;
        this.roadLayer = roadLayer;

        
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

    hasOptions() {
        return true;
    }

    isSelectionTool() {
        return false;
    }

    refresh() {
        
    }
}

export default SettingsMapTool;

