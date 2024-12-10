import { makeAutoObservable, runInAction } from "mobx";
import { Coordinate } from "ol/coordinate";
import SelectEdgeResponse from "./SelectEdgeResponse";
import { LineString } from "ol/geom";
import GeoJSON from "ol/format/GeoJSON";
import { ModifyRoadDataDTO, NewRoadDataDTO, RemoveRoadDataDTO, RoadCustomizationDTO, RoadCustomizationStorageDTO } from "./RoadCustomizationDTO";
import SelectRoadRequest from "./SelectRoadRequest";
import { ApiRequester } from "../api/ApiRequester";

enum RoadCustomizationType {
    NEW = 0,
    MODIFY = 1,
    REMOVE = 2
}

class NewRoadData {
    [key: string]: string | number | boolean | ((name: string, value: string | number | boolean) => void);
    snapStart: boolean;
    snapEnd: boolean;
    name: string;
    distance: number;
    forwardSpeed: number;
    backwardSpeed: number;
    roadClass: number;
    isFerry: boolean;
    isMotorway: boolean;
    forwardProhibited: boolean;
    backwardProhibited: boolean;

    constructor() {
        this.snapStart = true;
        this.snapEnd = true;
        this.name = "";
        this.distance = 1000;
        this.forwardSpeed = 70;
        this.backwardSpeed = 70;
        this.roadClass = 9;
        this.isFerry = false;
        this.isMotorway = false;
        this.forwardProhibited = false;
        this.backwardProhibited = false;

        makeAutoObservable(this);
    }

    setAttribute(name: string, value: string | number | boolean) {
        this[name] = value;
    }

    clear() {
        this.name = "";
        this.snapStart = true;
        this.snapEnd = true;
        this.distance = 1000;
        this.forwardSpeed = 70;
        this.backwardSpeed = 70;
        this.roadClass = 9;
        this.isFerry = false;
        this.isMotorway = false;
        this.forwardProhibited = false;
        this.backwardProhibited = false;
    }

    toDTO() {
        const dto: NewRoadDataDTO = {
            snapStart: this.snapStart,
            snapEnd: this.snapEnd,
            name: this.name,
            distance: this.distance,
            forwardSpeed: this.forwardSpeed,
            backwardSpeed: this.backwardSpeed,
            roadClass: this.roadClass,
            isFerry: this.isFerry,
            isMotorway: this.isMotorway,
            forwardProhibited: this.forwardProhibited,
            backwardProhibited: this.backwardProhibited,
        }
        return dto;
    }

    static fromDTO(dto: NewRoadDataDTO) {
        const obj = new NewRoadData();
        obj.snapStart = dto.snapStart;
        obj.snapEnd = dto.snapEnd;
        obj.name = dto.name
        obj.distance = dto.distance;
        obj.forwardSpeed = dto.forwardSpeed;
        obj.backwardSpeed = dto.backwardSpeed;
        obj.roadClass = dto.roadClass;
        obj.isFerry = dto.isFerry;
        obj.isMotorway = dto.isMotorway;
        obj.forwardProhibited = dto.forwardProhibited;
        obj.backwardProhibited = dto.backwardProhibited;
        return obj;
    }

}

class ModifyRoadData {
    [key: string]: string | number | boolean | ((name: string, value: string | number | boolean) => void);
    name: string;
    forwardSpeed: number;
    backwardSpeed: number;
    roadClass: number;
    isFerry: boolean;
    isMotorway: boolean;
    forwardProhibited: boolean;
    backwardProhibited: boolean;

    constructor() {
        this.name = "";
        this.forwardSpeed = 70;
        this.backwardSpeed = 70;
        this.roadClass = 9;
        this.isFerry = false;
        this.isMotorway = false;
        this.forwardProhibited = false;
        this.backwardProhibited = false;

        makeAutoObservable(this);
    }

    setAttribute(name: string, value: string | number | boolean) {
        this[name] = value;
    }

    clear() {
        this.name = "";
        this.forwardSpeed = 70;
        this.backwardSpeed = 70;
        this.roadClass = 9;
        this.isFerry = false;
        this.isMotorway = false;
        this.forwardProhibited = false;
        this.backwardProhibited = false;
    }

    toDTO() {
        const dto: ModifyRoadDataDTO = {
            name: this.name,
            forwardSpeed: this.forwardSpeed,
            backwardSpeed: this.backwardSpeed,
            roadClass: this.roadClass,
            isFerry: this.isFerry,
            isMotorway: this.isMotorway,
            forwardProhibited: this.forwardProhibited,
            backwardProhibited: this.backwardProhibited,
        }
        return dto;
    }

    static fromDTO(dto: ModifyRoadDataDTO) {
        const obj = new ModifyRoadData();
        obj.name = dto.name
        obj.forwardSpeed = dto.forwardSpeed;
        obj.backwardSpeed = dto.backwardSpeed;
        obj.roadClass = dto.roadClass;
        obj.isFerry = dto.isFerry;
        obj.isMotorway = dto.isMotorway;
        obj.forwardProhibited = dto.forwardProhibited;
        obj.backwardProhibited = dto.backwardProhibited;
        return obj;
    }
}

class RemoveRoadData {
    [key: string]: string | number | boolean | ((name: string, value: string | number | boolean) => void);
    name: string;

    constructor() {
        this.name = "";
        makeAutoObservable(this);
    }

    setAttribute(name: string, value: string | number | boolean) {
        this[name] = value;
    }

    clear() {
        this.name = "";
    }

    toDTO() {
        const dto: RemoveRoadDataDTO = {
            name: this.name,
        }
        return dto;
    }

    static fromDTO(dto: RemoveRoadDataDTO) {
        const obj = new RemoveRoadData();
        obj.name = dto.name
        return obj;
    }
}

class RoadCustomization {
    id: number;
    type: RoadCustomizationType;
    points: Coordinate[];
    preview: LineString | null;
    startConnection: SelectEdgeResponse | null;
    endConnection: SelectEdgeResponse | null;
    newRoad: NewRoadData;
    modifyRoad: ModifyRoadData;
    removeRoad: RemoveRoadData;

    constructor() {
        this.id = 0;
        this.points = [];
        this.type = RoadCustomizationType.NEW;
        this.newRoad = new NewRoadData();
        this.modifyRoad = new ModifyRoadData();
        this.removeRoad = new RemoveRoadData();
        this.preview = null;
        this.startConnection = null;
        this.endConnection = null;

        makeAutoObservable(this);
    }

    setType(type: RoadCustomizationType) {
        this.type = type;
    }

    setPoints(points: Coordinate[]) {
        this.points = points;
    }

    setPreview(preview: LineString) {
        this.preview = preview;
    }

    updateNewRoad() {
        const n = this.newRoad;
        const s = this.startConnection!;
        if (this.preview)
            n.distance = Math.round(this.preview.getLength());
        n.forwardSpeed = s.forwardSpeed;
        n.backwardSpeed = s.backwardSpeed;
        n.roadClass = s.attribute.class;
        n.isFerry = s.attribute.ferry;
        n.isMotorway = s.attribute.motorway;
        n.backwardProhibited = s.attribute.backwardProhibited;
        n.forwardProhibited = s.attribute.forwardProhibited;
    }

    updateModifyRoad() {
        const m = this.modifyRoad;
        const s = this.startConnection!;
        m.forwardSpeed = s.forwardSpeed;
        m.backwardSpeed = s.backwardSpeed;
        m.roadClass = s.attribute.class;
        m.isFerry = s.attribute.ferry;
        m.isMotorway = s.attribute.motorway;
        m.backwardProhibited = s.attribute.backwardProhibited;
        m.forwardProhibited = s.attribute.forwardProhibited;
    }

    clear() {
        this.points = [];
        this.newRoad.clear();
        this.modifyRoad.clear();
        this.removeRoad.clear();
        this.preview = null;
        this.startConnection = null;
        this.endConnection = null;
    }

    refresh(request: ApiRequester, year: number, updateFromStartConnection: boolean, loader: (customization: RoadCustomization) => void) {

        if (request.isActive()) {
            request.abortRequest();
        }

        if (this.points.length < 2) {
            return;
        }

        this.preview = null;

        const body: SelectRoadRequest = {
            year: year,
            lineString: new LineString(this.points)
        };

        switch (this.type) {
            case RoadCustomizationType.NEW:
                return request.newRoad(body)
                    .then(result => {
                        runInAction(() => {
                            const lineString = body.lineString.clone();
                            const coordinates = lineString.getCoordinates();
                            if (this.newRoad.snapStart && result.start.hasResult) {
                                coordinates[0] = result.start.connection;
                            }
                            if (this.newRoad.snapEnd && result.end.hasResult) {
                                coordinates[coordinates.length - 1] = result.end.connection;
                            }
                            lineString.setCoordinates(coordinates);
                            this.startConnection = result.start;
                            this.endConnection = result.end;
                            this.preview = lineString;
                            if (updateFromStartConnection)
                                this.updateNewRoad();
                            loader(this);
                        });
                    })
                    .catch(() => { })
                    .finally(() => request.reset())
                break;
            case RoadCustomizationType.MODIFY:
                return request.modifyRoad(body)
                    .then(result => {
                        if (result.hasResult) {
                            runInAction(() => {
                                this.startConnection = result.start;
                                this.preview = result.lineString;
                                if (updateFromStartConnection)
                                    this.updateModifyRoad();
                                loader(this);
                            });
                        }
                    })
                    .catch(() => { })
                    .finally(() => request.reset())
                break;
            case RoadCustomizationType.REMOVE:
                return request.removeRoad(body)
                    .then(result => {
                        if (result.hasResult) {
                            runInAction(() => {
                                this.preview = result.lineString;
                                loader(this);
                            });
                        }
                    })
                    .catch(() => { })
                    .finally(() => request.reset())
                break;
        }
    }

    getDataDTO() {
        if (this.type == RoadCustomizationType.NEW)
            return this.newRoad.toDTO();
        else if (this.type == RoadCustomizationType.MODIFY)
            return this.modifyRoad.toDTO();
        else
            return this.removeRoad.toDTO();
    }

    toStorageDTO() {
        const geojsonFormat = new GeoJSON();
        const geojsonLineString = geojsonFormat.writeGeometryObject(this.preview!);
        const dto: RoadCustomizationStorageDTO = {
            points: this.points,
            type: this.type,
            preview: geojsonLineString,
            startConnection: this.startConnection,
            endConnection: this.endConnection,
            data: this.getDataDTO()
        }
        return dto;
    }

    static fromStorageDTO(obj: RoadCustomizationStorageDTO) {
        const geojsonFormat = new GeoJSON();
        const customization = new RoadCustomization();
        customization.points = obj.points;
        customization.type = obj.type;
        customization.preview = geojsonFormat.readGeometry(obj.preview) as LineString;

        if (obj.type == RoadCustomizationType.NEW) {
            customization.newRoad = NewRoadData.fromDTO(obj.data as NewRoadDataDTO);
        } else if (obj.type == RoadCustomizationType.MODIFY) {
            customization.modifyRoad = ModifyRoadData.fromDTO(obj.data as ModifyRoadDataDTO);
        } else {
            customization.removeRoad = RemoveRoadData.fromDTO(obj.data as RemoveRoadDataDTO);
        }

        customization.startConnection = obj.startConnection;
        customization.endConnection = obj.endConnection;
        return customization;
    }

    toDTO() {
        const dto: RoadCustomizationDTO = {
            points: this.points,
            type: this.type,
            newRoad: this.newRoad.toDTO(),
            modifyRoad: this.modifyRoad.toDTO(),
            removeRoad: this.removeRoad.toDTO()
        }
        return dto;
    }

    static fromDTO(obj: RoadCustomizationDTO) {
        const customization = new RoadCustomization();
        customization.points = obj.points;
        customization.type = obj.type;

        if (obj.type == RoadCustomizationType.NEW) {
            customization.newRoad = NewRoadData.fromDTO(obj.newRoad as NewRoadDataDTO);
        } else if (obj.type == RoadCustomizationType.MODIFY) {
            customization.modifyRoad = ModifyRoadData.fromDTO(obj.modifyRoad as ModifyRoadDataDTO);
        } else {
            customization.removeRoad = RemoveRoadData.fromDTO(obj.removeRoad as RemoveRoadDataDTO);
        }

        return customization;
    }
}

export { RoadCustomization, RoadCustomizationType, NewRoadData, ModifyRoadData, RemoveRoadData };