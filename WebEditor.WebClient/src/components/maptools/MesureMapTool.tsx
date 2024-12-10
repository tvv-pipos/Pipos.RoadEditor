import MapTool from "../../model/MapTool";
import { DragPan, Draw, Interaction, Modify, MouseWheelZoom } from 'ol/interaction';
import { Vector } from 'ol/source';
import StraightenIcon from '@mui/icons-material/Straighten';
import { DrawEvent } from "ol/interaction/Draw";
import { Point } from "ol/geom";
import { SvgIconComponent } from "@mui/icons-material";
import { ApiRequester } from "../../api/ApiRequester";
import { action, makeAutoObservable, runInAction } from "mobx";
import MesureMapToolOptions from "../maptoolsoptions/MesureMapToolOption";
import { Feature } from "ol";
import LineStringResult from "../../model/LineStringResult";
import { FastestRouteStyle, ShortestRouteStyle, SourcePointStyle, TargetPointStyle } from "../map/MapStyles";
import MesureRequest from "../../model/MesureRequest";
import { rootStore } from "../../store/RootStore";


export class MesureMapTool implements MapTool {
    id: string;
    interactions: Interaction[];
    selectionSource: Vector;
    selectedRouteSource: Vector;
    icon: SvgIconComponent;
    options: JSX.Element;
    modifyInteractoion: Modify;
    drawInteraction: Draw;
    start: Point | null;
    end: Point | null;
    request: ApiRequester;
    includeConnectionDistrance: boolean;
    allowBidirectionalTravel: boolean;
    maxConnectionDistance: number;
    maxConnectionDistanceError: boolean;
    connectionSpeed: number;
    connectionSpeedError: boolean;
    shortestPath: LineStringResult | null;
    fastestPath: LineStringResult | null;
    loading: boolean;
    year: number;

    constructor(selectionSource: Vector, selectedRouteSource: Vector) {
        this.id = "Mesure";
        this.modifyInteractoion = new Modify({ source: selectionSource, condition: function(event) { return event.originalEvent && event.originalEvent.button != 1; }});
        this.drawInteraction = new Draw({ source: selectionSource, type: "Point", condition: function(event) { return event.originalEvent && event.originalEvent.button != 1; }});
        this.interactions = [this.drawInteraction, this.modifyInteractoion, new DragPan({ condition: function(event) { return event.originalEvent && event.originalEvent.button === 1; }}), new MouseWheelZoom()];
        this.icon = StraightenIcon;
        this.selectionSource = selectionSource;
        this.selectedRouteSource = selectedRouteSource;
        this.options = <MesureMapToolOptions tool={this} />;

        this.drawInteraction.on('drawstart', this.drawStart.bind(this));
        this.drawInteraction.on('drawend', this.drawEnd.bind(this));
        this.modifyInteractoion.on('modifystart', this.modifyStart.bind(this));
        this.modifyInteractoion.on('modifyend', this.modifyEnd.bind(this));

        this.start = null;
        this.end = null;
        this.request = new ApiRequester(rootStore);
        this.includeConnectionDistrance = true;
        this.allowBidirectionalTravel = false;
        this.maxConnectionDistance = 1000;
        this.maxConnectionDistanceError = false;
        this.connectionSpeed = 10;
        this.connectionSpeedError = false;
        this.shortestPath = null;
        this.fastestPath = null;
        this.year = 2024;
        this.loading = false;

        makeAutoObservable(this, {
            unLoad: action,
            modifyStart: action,
            modifyEnd: action,
            drawStart: action,
            drawEnd: action,
            setMaxConnectionDistance: action,
            setIncludeConnectionDistance: action,
            setConnectionSpeed: action,
            refresh: action,
            setAllowBidirectionalTravel: action
        });
    }

    load() {

    }

    unLoad(): void {
        this.start = null;
        this.end = null;
        this.selectionSource.clear();
        this.selectedRouteSource.clear();
        this.fastestPath = null;
        this.shortestPath = null;
    }

    setYear(year: number) {
        if (this.year != year) {
            this.year = year;
            this.refresh();
        }
    }

    isEmpty() {
        return this.start == null && this.end == null;
    }

    hasOptions() {
        return true;
    }

    isSelectionTool() {
        return true;
    }

    modifyStart(): void {
        runInAction(() => {
            this.selectedRouteSource.clear();
            this.clearSelectedRoute();
        });
    }

    modifyEnd(): void {
        if (this.selectionSource.getFeatures().length == 2) {
            runInAction(() => {
                this.clearSelectedRoute();
                const first = this.selectionSource.getFeatureById(1)!;
                const last = this.selectionSource.getFeatureById(2)!;
                this.start = (first.getGeometry() as Point);
                this.end = (last.getGeometry() as Point);
                this.refresh();
            });
        }
    }

    drawStart(): void {
        if (this.selectionSource.getFeatures().length >= 2) {
            runInAction(() => {
                this.selectionSource.clear();
                this.selectedRouteSource.clear();
                this.clearSelectedRoute();
            });
        }
    }

    drawEnd(event: DrawEvent): void {
        if (this.selectionSource.getFeatures().length == 1) {
            event.feature.setStyle(TargetPointStyle);
            event.feature.setId(2);
            runInAction(() => {
                const first = this.selectionSource.getFeatures()[0];
                this.start = (first.getGeometry() as Point);
                this.end = (event.feature.getGeometry() as Point);
                this.refresh();
            });

        } else {
            this.clearSelectedRoute();
            event.feature.setStyle(SourcePointStyle);
            event.feature.setId(1);
        }
    }

    setMaxConnectionDistance(maxConnectionDistance: number) {
        this.maxConnectionDistance = maxConnectionDistance;
        if (typeof maxConnectionDistance === 'number' && !isNaN(maxConnectionDistance) && maxConnectionDistance >= 25) {
            this.maxConnectionDistanceError = false;
            this.refresh();
        } else {
            this.maxConnectionDistanceError = true;
        }
    };

    setIncludeConnectionDistance(includeConnectionDistrance: boolean) {
        this.includeConnectionDistrance = includeConnectionDistrance;
        this.refresh();
    };

    setAllowBidirectionalTravel(allowBidirectionalTravel: boolean) {
        this.allowBidirectionalTravel = allowBidirectionalTravel;
        this.refresh();
    }

    setConnectionSpeed(connectionSpeed: number) {
        this.connectionSpeed = connectionSpeed;
        if (typeof connectionSpeed === 'number' && !isNaN(connectionSpeed) && connectionSpeed >= 1) {
            this.connectionSpeedError = false;
            this.refresh();
        } else {
            this.connectionSpeedError = true;
        }
    }

    clearSelectedRoute() {
        if (this.request != null)
            this.request.abortRequest();

        this.shortestPath = null;
        this.fastestPath = null;
    }

    async refresh() {
        this.clearSelectedRoute();

        if (this.start && this.end) {
            this.selectedRouteSource.clear();
            this.shortestPath = null;
            this.fastestPath = null;
            runInAction(() => {
                this.loading = true;
            });
            const start = this.start.getCoordinates();
            const end = this.end.getCoordinates();
            const body: MesureRequest = {
                startX: start[0], startY: start[1], endX: end[0], endY: end[1],
                year: this.year, connectionSpeed: this.connectionSpeed,
                includeConnectionDistance: this.includeConnectionDistrance,
                maxConnectionDistance: this.maxConnectionDistance,
                allowBidirectionalTravel: this.allowBidirectionalTravel
            };
            await this.request.mesuare(body)
                .then(result => {
                    if (result.hasResult) {
                        runInAction(() => {
                            this.selectedRouteSource.clear();
                            const fastest = new Feature(result.fastest.lineString);
                            fastest.setStyle(FastestRouteStyle);
                            this.selectedRouteSource.addFeature(fastest);
                            this.fastestPath = result.fastest;

                            const shortest = new Feature(result.shortest.lineString);
                            shortest.setStyle(ShortestRouteStyle);
                            this.selectedRouteSource.addFeature(shortest);
                            this.shortestPath = result.shortest;
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                 })
                .finally(() => { this.request.reset() });
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}

export default MesureMapTool;
