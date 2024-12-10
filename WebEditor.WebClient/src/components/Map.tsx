import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import OLMap from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import MapTools from './MapTools';
import PanMapTool from './maptools/PanMapTool';
import MesureMapTool from './maptools/MesureMapTool';
import RoadMapTool from './maptools/RoadMapTool';
import { defaults as defaultControls } from 'ol/control';
import MapToolOptions from './MapToolOptions';
import MapLayer from './map/MapLayer';
import CustomRoadLayer from './map/CustomRoadLayer';
import SelectionLayer from './map/SelectionLayer';
import SelectedRouteLayer from './map/SelectedRouteLayer';
import { SwedenView, FitToSweden } from './map/MapUtils'
import { useStore } from '../UseStore';
import { observer } from 'mobx-react-lite';
import { RoadLayer, updateRoadSource } from './map/RoadLayer';
import SelectEdgeMapTool from './maptools/SelectEdgeMapTool';
import RoadCustomizationsMapTool from './maptools/RoadCustomizationsMapTool';
import SettingsMapTool from './maptools/SettingsMapTool';

const Map: React.FC = observer(() => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [customRoadSource] = useState<VectorSource>(new VectorSource());
  const [map, setMap] = useState<OLMap | null>(null);
  const store = useStore();

  useEffect(() => {
    if (mapElement.current) {
      const selectedRouteSource = new VectorSource();
      const selectionSource = new VectorSource();

      const newMap = new OLMap({
        target: mapElement.current,
        layers: [
          MapLayer,
          RoadLayer,
          CustomRoadLayer(customRoadSource),
          SelectionLayer(selectionSource),
          SelectedRouteLayer(selectedRouteSource)
        ],
        view: SwedenView,
        interactions: [],
        controls: defaultControls({ zoom: false }),
      });

      FitToSweden(newMap);

      const resizeObserver = new ResizeObserver(() => {
        newMap.updateSize();
      });

      resizeObserver.observe(mapElement.current);
      setMap(newMap);

      const tools = [
        new PanMapTool(),
        new MesureMapTool(selectionSource, selectedRouteSource),
        new SelectEdgeMapTool(selectionSource, selectedRouteSource),
        new RoadMapTool(selectionSource, selectedRouteSource),
        new RoadCustomizationsMapTool(customRoadSource, store, newMap),
        new SettingsMapTool(MapLayer, RoadLayer)
      ];

      store.setTools(tools);
      store.setCurrentTool(tools[0]);

      return () => {
        newMap.setTarget(undefined);
        if (mapElement.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          resizeObserver.unobserve(mapElement.current);
        }
      };
    }
  }, [store, customRoadSource]);

  // Run when year changes
  useEffect(() => {
    // Load new road network
    updateRoadSource(store.year);
  }, [store.year])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={mapElement} style={{ backgroundColor: '#FFFFFFFF', width: '100%', height: '100%' }} />
      {map && <MapTools map={map} />}
      <MapToolOptions />
    </div>
  );
});

export default Map;