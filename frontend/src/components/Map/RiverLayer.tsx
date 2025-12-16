import { useEffect } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';

interface RiverLayerProps {
  map: MapLibreMap | null;
  visible: boolean;
  streamOrderLevel: 'small' | 'medium' | 'large' | 'full';
}

const STREAM_ORDER_COLORS = {
  1: '#e0f3f8',
  2: '#cfe2f3',
  3: '#a1dab4',
  4: '#74c476',
  5: '#41b6c4',
  6: '#2c7fb8',
  7: '#1d91c0',
  8: '#0c2c84',
  9: '#0066cc',
  10: '#003366'
};

export function RiverLayer({ map, visible, streamOrderLevel }: RiverLayerProps) {

  useEffect(() => {
    if (!map || !visible) return;

    const sourceId = `rivers-${streamOrderLevel}`;
    const layerId = `rivers-${streamOrderLevel}-layer`;
    const sourceUrl = `${import.meta.env.BASE_URL}data/rivers_turkey_${streamOrderLevel}.geojson`;

    // Add source if not exists
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: sourceUrl,
      });
    }

    // Add line layer with stream order styling
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': [
            'match',
            ['get', 'ORD_STRA'],
            1, STREAM_ORDER_COLORS[1],
            2, STREAM_ORDER_COLORS[2],
            3, STREAM_ORDER_COLORS[3],
            4, STREAM_ORDER_COLORS[4],
            5, STREAM_ORDER_COLORS[5],
            6, STREAM_ORDER_COLORS[6],
            7, STREAM_ORDER_COLORS[7],
            8, STREAM_ORDER_COLORS[8],
            9, STREAM_ORDER_COLORS[9],
            10, STREAM_ORDER_COLORS[10],
            '#3498db' // Fallback
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, // At zoom 5
            [
              'case',
              ['<', ['get', 'ORD_STRA'], 4], 0.5,
              ['<', ['get', 'ORD_STRA'], 7], 1,
              1.5
            ],
            12, // At zoom 12
            [
              'case',
              ['<', ['get', 'ORD_STRA'], 4], 1,
              ['<', ['get', 'ORD_STRA'], 7], 2,
              3
            ]
          ],
          'line-opacity': 0.7
        }
      });
    }

    // Add hover effect
    map.on('mouseenter', layerId, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = '';
    });

    // Add click handler for river info
    map.on('click', layerId, (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const props = feature.properties;
        
        // Create popup with river info
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${props.MAIN_RIV || 'River'}</h3>
              <div class="text-xs mt-1 space-y-0.5">
                <div>Stream Order: <span class="font-medium">${props.ORD_STRA}</span></div>
                <div>Length: <span class="font-medium">${(props.LENGTH_KM || 0).toFixed(1)} km</span></div>
                <div>Upstream Area: <span class="font-medium">${(props.UPLAND_SKM || 0).toFixed(0)} km²</span></div>
              </div>
            </div>
          `)
          .addTo(map);
      }
    });

    return () => {
      // Cleanup
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, visible, streamOrderLevel]);

  return null;
}
