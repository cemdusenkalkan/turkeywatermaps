import { useEffect } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

interface BasinLayerProps {
  map: MapLibreMap | null;
  visible: boolean;
  level: 'detailed' | 'l6' | 'l7';
  selectedCategory: string | null;
  colorScale: (value: number) => string;
}

export function BasinLayer({ map, visible, level, selectedCategory, colorScale }: BasinLayerProps) {

  useEffect(() => {
    if (!map || !visible || !selectedCategory) return;

    const sourceId = `basins-${level}`;
    const layerId = `basins-${level}-layer`;
    const sourceUrl = `${import.meta.env.BASE_URL}data/basins_turkey_${level}.geojson`;

    // Add source if not exists
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: sourceUrl,
      });
    }

    // Add fill layer
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': [
            'case',
            ['has', `${selectedCategory}_raw`],
            [
              'interpolate',
              ['linear'],
              ['get', `${selectedCategory}_raw`],
              0, '#ffffcc',
              0.25, '#a1dab4',
              0.5, '#41b6c4',
              0.75, '#2c7fb8',
              1, '#253494'
            ],
            '#cccccc' // No data
          ],
          'fill-opacity': 0.7,
          'fill-outline-color': '#000000'
        }
      });
    }

    // Add border layer
    const borderLayerId = `${layerId}-border`;
    if (!map.getLayer(borderLayerId)) {
      map.addLayer({
        id: borderLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#333333',
          'line-width': 1
        }
      });
    }

    // Add hover effect
    let hoveredBasinId: string | number | null = null;

    map.on('mousemove', layerId, (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredBasinId !== null) {
          map.setFeatureState(
            { source: sourceId, id: hoveredBasinId },
            { hover: false }
          );
        }
        hoveredBasinId = e.features[0].id || null;
        if (hoveredBasinId !== null) {
          map.setFeatureState(
            { source: sourceId, id: hoveredBasinId },
            { hover: true }
          );
        }
        map.getCanvas().style.cursor = 'pointer';
      }
    });

    map.on('mouseleave', layerId, () => {
      if (hoveredBasinId !== null) {
        map.setFeatureState(
          { source: sourceId, id: hoveredBasinId },
          { hover: false }
        );
      }
      hoveredBasinId = null;
      map.getCanvas().style.cursor = '';
    });

    return () => {
      // Cleanup
      if (map.getLayer(borderLayerId)) {
        map.removeLayer(borderLayerId);
      }
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, visible, level, selectedCategory, colorScale]);

  return null;
}
