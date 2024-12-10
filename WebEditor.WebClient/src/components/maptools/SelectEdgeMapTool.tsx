import MapTool from "../../model/MapTool";
import { DragPan, Draw, Interaction, Modify, MouseWheelZoom } from 'ol/interaction';
import { Vector } from 'ol/source';
import PlaceIcon from '@mui/icons-material/Place';
import { DrawEvent } from "ol/interaction/Draw";
import { Point } from "ol/geom";
import { SvgIconComponent } from "@mui/icons-material";
import { ApiRequester } from "../../api/ApiRequester";
import { action, makeAutoObservable, runInAction } from "mobx";
import { Feature } from "ol";
import SelectEdgeResponse from "../../model/SelectEdgeResponse";
import SelectEdgeRequest from "../../model/SelectEdgeRequest";
import SelectEdgeMapToolOptions from "../maptoolsoptions/SelectEdgeMapToolOptions";
import { SelectedEdgeStyle, SelectionPointStyle, SourcePointStyle, TargetPointStyle } from "../map/MapStyles";
import { rootStore } from "../../store/RootStore";


export class SelectEdgeMapTool implements MapTool {
    id: string;
    interactions: Interaction[];
    selectionSource: Vector;
    selectedRouteSource: Vector;
    icon: SvgIconComponent;
    options: JSX.Element;
    modifyInteractoion: Modify;
    drawInteraction: Draw;
    point: Point | null;
    request: ApiRequester | null;
    selectedEdge: SelectEdgeResponse | null;
    year: number;

    constructor(selectionSource: Vector, selectedRouteSource: Vector) {
        this.id = "SelectEdge";
        this.modifyInteractoion = new Modify({ source: selectionSource, condition: function(event) { return event.originalEvent && event.originalEvent.button != 1; }});
        this.drawInteraction = new Draw({ source: selectionSource, type: "Point", condition: function(event) { return event.originalEvent && event.originalEvent.button != 1; }});
        this.interactions = [this.drawInteraction, this.modifyInteractoion, new DragPan({ condition: function(event) { return event.originalEvent && event.originalEvent.button === 1; }}), new MouseWheelZoom()];
        this.icon = PlaceIcon;
        this.selectionSource = selectionSource;
        this.selectedRouteSource = selectedRouteSource;
        this.options = <SelectEdgeMapToolOptions tool={this}/>;

        this.drawInteraction.on('drawstart', this.drawStart.bind(this));
        this.drawInteraction.on('drawend', this.drawEnd.bind(this));
        this.modifyInteractoion.on('modifystart', this.modifyStart.bind(this));
        this.modifyInteractoion.on('modifyend', this.modifyEnd.bind(this));

        this.point = null;
        this.request = null;
        this.selectedEdge = null;
        this.year = 2024;

        makeAutoObservable(this, {
            unLoad: action,
            modifyStart: action,
            modifyEnd: action,
            drawStart: action,
            drawEnd: action,
            refresh: action
        });
    }
    
    load() {
        
    }

    unLoad(): void {
        this.point = null;
        this.selectionSource.clear();
        this.selectedRouteSource.clear();
        this.selectedEdge = null;
    }

    setYear(year: number) {
        if (this.year != year) {
            this.year = year;
            this.refresh();
        }
    }

    isEmpty() {
        return this.point == null;
    }

    hasOptions() {
        return this.selectedEdge != null;
    }

    isSelectionTool() {
        return true;
    }

    modifyStart(): void {
        this.selectedRouteSource.clear();
        this.clearSelectedRoute();
    }

    modifyEnd(): void {
        this.clearSelectedRoute();
        const feature = this.selectionSource.getFeatures()[0];
        this.point = (feature.getGeometry() as Point);
        this.refresh();
    }

    drawStart(): void {
        this.selectionSource.clear();
        this.selectedRouteSource.clear();
        this.clearSelectedRoute();
    }

    drawEnd(event: DrawEvent): void {
        event.feature.setStyle(SelectionPointStyle);
        runInAction(() => {
            this.point = (event.feature.getGeometry() as Point);
            this.refresh();
        });
    }

    clearSelectedRoute() {
        if (this.request != null)
            this.request.abortRequest();
        this.selectedEdge = null;
    }

    refresh() {
        this.clearSelectedRoute();

        if (this.point != null) {
            this.selectedRouteSource.clear();
            this.selectedEdge = null;

            const coords = this.point.getCoordinates();
            const body: SelectEdgeRequest = {
                x: coords[0], y: coords[1], year: this.year
            };
            this.request = new ApiRequester(rootStore);
            this.request.selectEdge(body)
                .then(result => {
                    runInAction(() => {
                        const coordinates = result.segments.getCoordinates();
                        const source = coordinates[0]; 
                        const target = coordinates[coordinates.length - 1];

                        const feature = new Feature(result.segments);
                        feature.setStyle(SelectedEdgeStyle);
                        this.selectedRouteSource.clear();
                        this.selectedRouteSource.addFeature(feature);
                        const sourcePoint = new Feature(new Point(source));
                        sourcePoint.setStyle(SourcePointStyle);
                        const targetPoint = new Feature(new Point(target));
                        targetPoint.setStyle(TargetPointStyle);
                        this.selectedRouteSource.addFeatures([sourcePoint, targetPoint]);
                        this.selectedEdge = result;
                    });

                })
                .catch(() => { })
                .finally(() => { this.request = null });
        }
    }
}

export default SelectEdgeMapTool;
