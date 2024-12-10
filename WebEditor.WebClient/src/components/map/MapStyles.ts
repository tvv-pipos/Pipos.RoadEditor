import { Fill, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

const SourcePointStyle = new Style({
    image: new RegularShape({
        points: 3,
        radius: 12,
        fill: new Fill({ color: '#6B8E2350' }),
        stroke: new Stroke({ color: '#6B8E23', width: 2 })
    })
});

const TargetPointStyle = [new Style({
    image: new CircleStyle({
        radius: 10,
        stroke: new Stroke({ color: '#CD5C5C', width: 2 })
    })
}), new Style({
    image: new CircleStyle({
        radius: 6,
        stroke: new Stroke({ color: '#CD5C5C', width: 2 })
    })
})];

const FastestRouteStyle = new Style({
    stroke: new Stroke({
        color: '#FF4500',
        width: 2,
    })
});

const ShortestRouteStyle = new Style({
    stroke: new Stroke({
        color: '#008000',
        width: 2,
    })
});

const SelectedEdgeStyle = new Style({
    stroke: new Stroke({
        color: '#FFD700',
        width: 2,
    })
});

const NewEdgeStyle = new Style({
    stroke: new Stroke({
        color: '#50C878',
        width: 2,
    })
});

const ModifyEdgeStyle = new Style({
    stroke: new Stroke({
        color: '#4169E1',
        width: 2,
    })
});

const RemoveEdgeStyle = new Style({
    stroke: new Stroke({
        color: '#FF8C00',
        width: 2,
    })
});


const SelectionPointStyle = new Style({
    image: new CircleStyle({
        radius: 4,
        fill: new Fill({
            color: '#FFD700',
        }),
    }),
});


export { SourcePointStyle, TargetPointStyle, FastestRouteStyle, 
         ShortestRouteStyle, SelectedEdgeStyle, NewEdgeStyle, 
         ModifyEdgeStyle, RemoveEdgeStyle, SelectionPointStyle };