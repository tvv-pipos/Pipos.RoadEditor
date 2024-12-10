import MapTool from "../../model/MapTool";
import { DragPan, Interaction, MouseWheelZoom, PinchZoom, Select } from 'ol/interaction';
import { SvgIconComponent } from "@mui/icons-material";
import { action, makeAutoObservable, runInAction } from "mobx";
import RoadCustomizationOptions from "../maptoolsoptions/RoadCustomizationOptions";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Vector } from "ol/source";
import { RoadCustomization, RoadCustomizationType } from "../../model/RoadCustomization";
import { Feature } from "ol";
import { ModifyEdgeStyle, NewEdgeStyle, RemoveEdgeStyle, SelectedEdgeStyle } from "../map/MapStyles";
import { SelectEvent } from "ol/interaction/Select";
import { click } from "ol/events/condition";
import OLMap from 'ol/Map';
import { buffer as bufferExtent, getWidth, getHeight } from "ol/extent";
import { ApiRequester } from "../../api/ApiRequester";
import { RootStore } from "../../store/RootStore";

export class RoadCustomizationsMapTool implements MapTool {
    id: string;
    map: OLMap;
    customRoadSource: Vector;
    store: RootStore;
    selectInteraction: Select;
    interactions: Interaction[];
    icon: SvgIconComponent;
    options: JSX.Element;
    selectedId: number | null;
    year: number;
    loading: number;
    request: ApiRequester;


    constructor(customRoadSource: Vector, store: RootStore, map: OLMap) {
        this.id = "RoadCustomizations";
        this.map = map;
        this.customRoadSource = customRoadSource;
        this.store = store;
        this.selectInteraction = new Select({ condition: click, style: () => SelectedEdgeStyle });
        this.interactions = [this.selectInteraction, new PinchZoom(), new DragPan({ condition: function (event) { return event.originalEvent && event.originalEvent.button === 1; } }), new MouseWheelZoom()];
        this.icon = FormatListBulletedIcon;
        this.selectedId = null;
        this.options = (<RoadCustomizationOptions tool={this} />);
        this.year = 2024;
        this.selectInteraction.on('select', this.selectOnMap.bind(this));
        this.loading = -1;
        this.refresh();
        this.request = new ApiRequester(store);

        makeAutoObservable(this, {
            unLoad: action
        });
    }

    load() {

    }

    unLoad(): void {
        this.selectedId = null;
        const selectedFeatures = this.selectInteraction.getFeatures();
        selectedFeatures.clear();
    }

    setYear(year: number) {
        if(this.year != year) {
            this.year = year;
            this.fullRefresh();
        }
    }

    isEmpty() {
        return this.store.customizations.length == 0;
    }

    hasOptions() {
        return this.store.customizations.length > 0;
    }

    isSelectionTool() {
        return true;
    }

    getSelectedFeaturesExtent = () => {
        const selectedFeatures = this.selectInteraction.getFeatures();
        const firstFeature: Feature = selectedFeatures.item(0); 
        if (firstFeature) { 
            return firstFeature.getGeometry()?.getExtent(); 
        } 
        return null
    };

    zoomInOnCustomizations() {
        let extent = this.getSelectedFeaturesExtent();
        if(extent == null)
            extent = this.customRoadSource.getExtent();
        const buffer = Math.max(getWidth(extent), getHeight(extent)) * 0.1;
        const bufferedExtent = bufferExtent(extent, buffer);
        this.map.getView().fit(bufferedExtent, { duration: 1000 });
    }

    getStyle(type: RoadCustomizationType) {
        switch (type) {
            case RoadCustomizationType.NEW:
                return NewEdgeStyle;
            case RoadCustomizationType.MODIFY:
                return ModifyEdgeStyle;
            default:
                return RemoveEdgeStyle
        }
    }

    selectOnMap(event: SelectEvent) {
        event.stopPropagation();
        const selectedFeatures = this.selectInteraction.getFeatures();

        if (selectedFeatures.getLength() > 1) {
            const [newSelection] = selectedFeatures.getArray();
            selectedFeatures.clear();
            selectedFeatures.push(newSelection);
            this.selectedId = newSelection.getId() as number;
        } else if (selectedFeatures.getLength() > 0) {
            const [newSelection] = selectedFeatures.getArray();
            this.selectedId = newSelection.getId() as number;
        } else {
            this.selectedId = null;
        }
    }

    select(id: number | null) {
        if (id != null) {
            this.selectedId = id;
            const feature = this.customRoadSource.getFeatureById(id);
            this.selectInteraction.getFeatures().clear();
            this.selectInteraction.getFeatures().push(feature!);
        }
    }

    refresh() {
        this.customRoadSource.clear();
        this.store.customizations.forEach((customizaton) => {
            if (customizaton.preview) {
                const feature = new Feature(customizaton.preview);
                feature.setId(customizaton.id);
                feature.setStyle(this.getStyle(customizaton.type));
                this.customRoadSource.addFeature(feature);
            }
        });
    }

    async fullRefresh() {
        const customRoadSource = this.customRoadSource; 
        customRoadSource.clear();
        this.store.setLoading(true);
        await this.store.clearCustomizationSession(false);

        for(let i = 0; i < this.store.customizations.length; i++) {
            runInAction(() => {
                this.loading = i;
            });
            await this.store.customizations[i].refresh(this.request, this.year, false, (custom: RoadCustomization) => {
                if (custom.preview != null) {
                    const feature = new Feature(custom.preview);
                    feature.setId(custom.id);
                    feature.setStyle(this.getStyle(custom.type));
                    customRoadSource.addFeature(feature);
                }
            });
            await this.store.syncCustomizationArray(this.store.customizations.slice(0, i + 1), false);
        }

        runInAction(() => {
            this.loading = -1;
        }); 
        this.store.setLoading(false);
    }
}

export default RoadCustomizationsMapTool;

