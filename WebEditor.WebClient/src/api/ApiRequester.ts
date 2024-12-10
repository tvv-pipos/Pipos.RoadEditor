import GeoJSON from "ol/format/GeoJSON";
import { LineString } from "ol/geom";
import SelectRoadRequest from "../model/SelectRoadRequest";
import SelectEdgeRequest from "../model/SelectEdgeRequest";
import SelectEdgeResponse from "../model/SelectEdgeResponse";
import MesureRequest from "../model/MesureRequest";
import MesureResponse from "../model/MesureResponse";
import NewRoadResponse from "../model/NewRoadResponse";
import ModifyRoadResponse from "../model/ModifyRoadResponse";
import RemoveRoadResponse from "../model/RemoveRoadResponse";
import { RoadNetworkCustomizationDTO } from "../model/RoadCustomizationDTO";
import { RootStore } from "../store/RootStore";

export class ApiRequester {
    private controller: AbortController;
    private active: boolean;
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.controller = new AbortController();
        this.active = false;
        this.rootStore = rootStore; 
    }

    public reset() {
        this.controller = new AbortController();
        this.active = false;
    }

    public isActive() {
        return this.active;
    }
    
    public abortRequest() {
        this.controller.abort();
        this.controller = new AbortController();
        this.active = false;
    }

    toLineString(source: any) {
        const format = new GeoJSON();
        const feature = format.readFeature(source);
        if (Array.isArray(feature)) {
            return feature[0].getGeometry() as LineString;
        } else {
            return feature.getGeometry() as LineString;
        }
    }

    public async mesuare(request: MesureRequest) {
        this.active = true;
        return fetch("/api/road/MesureTimeDistance", { 
            signal: this.controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })
            .then(response => {
                if(response.status == 401)
                    this.rootStore.session.setSession(null);
                return response.json();
            })
            .then((result: MesureResponse) => {
                if(result.hasResult) {
                    result.shortest.lineString = this.toLineString(result.shortest.lineString)
                    result.fastest.lineString = this.toLineString(result.fastest.lineString)
                }
                return result;
            })
    }

    public async newRoad(request: SelectRoadRequest) {
        this.active = true;
        const format = new GeoJSON();
        const obj = {
            lineString: format.writeGeometryObject(request.lineString),
            year: request.year
        };
        
        return fetch("/api/road/NewRoad", { 
            signal: this.controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => {
                if(response.status == 401)
                    this.rootStore.session.setSession(null);
                return response.json();
            })
            .then((result: NewRoadResponse) => {
                if(result.start.hasResult)
                    result.start.segments = this.toLineString(result.start.segments);
                if(result.end.hasResult)
                    result.end.segments = this.toLineString(result.end.segments);
                return result;
            })
    }

    public async modifyRoad(request: SelectRoadRequest) {
        this.active = true;
        const format = new GeoJSON();
        const obj = {
            lineString: format.writeGeometryObject(request.lineString),
            year: request.year
        };
        
        return fetch("/api/road/ModifyRoad", { 
            signal: this.controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => {
                if(response.status == 401)
                    this.rootStore.session.setSession(null);
                return response.json();
            })
            .then((result: ModifyRoadResponse) => {
                if(result.hasResult) {
                    result.lineString = this.toLineString(result.lineString);
                    return result;
                }
                throw new Error('Responce failed!');
            })
    }

    public async removeRoad(request: SelectRoadRequest) {
        this.active = true;
        const format = new GeoJSON();
        const obj = {
            lineString: format.writeGeometryObject(request.lineString),
            year: request.year
        };
        
        return fetch("/api/road/RemoveRoad", { 
            signal: this.controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => {
                if(response.status == 401)
                    this.rootStore.session.setSession(null);
                return response.json();
            })
            .then((result: RemoveRoadResponse) => {
                if(result.hasResult) {
                    result.lineString = this.toLineString(result.lineString);
                    return result;
                }
                throw new Error('Responce failed!');
            })
    }


    public async selectEdge(request: SelectEdgeRequest) {
        this.active = true;
        return fetch("/api/road/SelectEdge", { 
            signal: this.controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })
            .then(response => {
                if(response.status == 401)
                    this.rootStore.session.setSession(null);
                return response.json();
            })
            .then((result: SelectEdgeResponse) => {
                if(result.hasResult) {
                    result.segments = this.toLineString(result.segments);
                    return result;
                }
                throw new Error('Responce failed!');
            })
    }

    public async updateCustomization(request: RoadNetworkCustomizationDTO) {
        this.active = true;
        await fetch("/api/road/UpdateCustomization", { 
            signal: this.controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
    }
}
