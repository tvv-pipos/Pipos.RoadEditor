import MapTool from "../../model/MapTool";
import { Vector } from 'ol/source';
import { SvgIconComponent } from "@mui/icons-material";
import { DragPan, Draw, Interaction, Modify, MouseWheelZoom } from "ol/interaction";
import { action, makeAutoObservable, runInAction } from "mobx";
import { DrawEvent } from "ol/interaction/Draw";
import { LineString, Point } from "ol/geom";
import { Feature } from "ol";
import { ApiRequester } from "../../api/ApiRequester";
import RoadMapToolOptions from "../maptoolsoptions/RoadMapToolOptions";
import { RoadCustomization } from "../../model/RoadCustomization";
import { SelectionPointStyle, SelectedEdgeStyle, SourcePointStyle, TargetPointStyle } from "../map/MapStyles";
import PolylineIcon from '@mui/icons-material/Polyline';
import { rootStore } from "../../store/RootStore";

export class RoadMapTool implements MapTool {
    id: string;
    interactions: Interaction[];
    modifyInteractoion: Modify;
    drawInteraction: Draw;
    selectionSource: Vector;
    selectedRouteSource: Vector;
    icon: SvgIconComponent;
    options: JSX.Element;
    year: number;
    request: ApiRequester;
    roadCustomization: RoadCustomization;
    loading: boolean;

    constructor(selectionSource: Vector, selectedRouteSource: Vector) {
        this.id = "Road";
        this.modifyInteractoion = new Modify({ source: selectionSource, condition: function (event) { return event.originalEvent && event.originalEvent.button != 1; } });
        this.drawInteraction = new Draw({ source: selectionSource, type: "LineString", condition: function (event) { return event.originalEvent && event.originalEvent.button != 1; } });
        this.interactions = [this.drawInteraction, this.modifyInteractoion, new DragPan({ condition: function (event) { return event.originalEvent && event.originalEvent.button === 1; } }), new MouseWheelZoom()];
        this.icon = PolylineIcon;
        this.selectionSource = selectionSource;
        this.selectedRouteSource = selectedRouteSource;
        this.year = 2024;
        this.roadCustomization = new RoadCustomization();
        this.options = <RoadMapToolOptions tool={this} />;
        this.request = new ApiRequester(rootStore);
        this.loading = false;

        this.drawInteraction.on('drawstart', this.drawStart.bind(this));
        this.drawInteraction.on('drawend', this.drawEnd.bind(this));
        this.modifyInteractoion.on('modifystart', this.modifyStart.bind(this));
        this.modifyInteractoion.on('modifyend', this.modifyEnd.bind(this));


        makeAutoObservable(this, {
            unLoad: action
        });
    }

    load(roadCustomization: RoadCustomization | null) {
        if (roadCustomization == null)
            return;
        runInAction(() => {
            this.clear();
            this.roadCustomization = roadCustomization;
            const points = this.roadCustomization.points;
            for (let i = 0; i < points.length; i++) {
                const point = new Point(points[i]);
                const pointFeature = new Feature(point);
                pointFeature.setId(i);
                if (i == 0)
                    pointFeature.setStyle(SourcePointStyle);
                else if (i == points.length - 1)
                    pointFeature.setStyle(TargetPointStyle);
                else
                    pointFeature.setStyle(SelectionPointStyle);
                this.selectionSource.addFeature(pointFeature);
            }
            if (this.roadCustomization.preview) {
                const feature = new Feature(this.roadCustomization.preview);
                feature.setStyle(SelectedEdgeStyle);
                this.selectedRouteSource.addFeature(feature);
            }
        });
    }

    unLoad(): void {
        this.clear();
    }

    setYear(year: number) {
        if(this.year != year)
        {
            this.year = year;
            this.refresh();
        }
    }

    isEmpty() {
        return this.roadCustomization.preview == null;
    }

    hasOptions() {
        return true;
    }

    isSelectionTool() {
        return true;
    }

    setRoadCustomization(roadCustomization: RoadCustomization) {
        runInAction(() => {
            this.roadCustomization = roadCustomization;
        });
    }

    modifyStart(): void {

    }

    modifyEnd(): void {
        const features = this.selectionSource.getFeatures();
        const points = features
            .filter(feature => feature.getGeometry() instanceof Point)
            .sort((a, b) => (a.getId() as number) - (b.getId() as number))
            .map(feature => (feature.getGeometry() as Point).getCoordinates());

        this.roadCustomization.setPoints(points);
        this.refresh(true);
    }

    drawStart(): void {
        this.clear();
    }

    drawEnd(event: DrawEvent): void {
        this.selectionSource.clear();

        const feature = event.feature;
        const geometry = feature.getGeometry() as LineString;

        if (geometry.getType() === 'LineString') {
            const coordinates = geometry.getCoordinates();
            for (let i = 0; i < coordinates.length; i++) {
                const coordinate = coordinates[i];
                const point = new Point(coordinate);
                const pointFeature = new Feature(point);
                pointFeature.setId(i);
                if (i == 0)
                    pointFeature.setStyle(SourcePointStyle);
                else if (i == coordinates.length - 1)
                    pointFeature.setStyle(TargetPointStyle);
                else
                    pointFeature.setStyle(SelectionPointStyle);
                this.selectionSource.addFeature(pointFeature);
            }
            this.roadCustomization.setPoints(coordinates);
            this.refresh(true);
        }

        setTimeout(() => {
            this.selectionSource.removeFeature(feature);
        }, 0);
    }

    clearSelectedRoute() {
        if (this.request.isActive())
            this.request.abortRequest();
        this.selectedRouteSource.clear();
        this.roadCustomization.preview = null;
        this.roadCustomization.startConnection = null;
        this.roadCustomization.endConnection = null;
    }

    clear() {
        runInAction(() => {
            if (this.request.isActive())
                this.request.abortRequest();
            this.selectedRouteSource.clear();
            this.selectionSource.clear();
            this.roadCustomization.clear();
        });
    }

    async refresh(updateFromStartConnection: boolean = false) {
        this.clearSelectedRoute();
        runInAction(() => {
            this.loading = true;
        });
        await this.roadCustomization.refresh(this.request, this.year, updateFromStartConnection, (customization: RoadCustomization) => {
            if (customization.preview != null) {
                runInAction(() => {
                    this.selectedRouteSource.clear();
                    const feature = new Feature(customization.preview!);
                    feature.setStyle(SelectedEdgeStyle);
                    this.selectedRouteSource.addFeature(feature);
                });
            }
        });
        runInAction(() => {
            this.loading = false;
        });
    }
}

export default RoadMapTool;   