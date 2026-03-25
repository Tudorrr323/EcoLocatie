import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { MarkerData } from '../types/map.types';
import { mapStyles } from '../styles/map.styles';

export interface MapRef {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
}

interface InteractiveMapProps {
  markers: MarkerData[];
}

function buildHtml(markers: MarkerData[]): string {
  const markersJson = JSON.stringify(
    markers.map((m) => ({
      id: m.id,
      lat: m.latitude,
      lng: m.longitude,
      color: m.plant.icon_color || '#4CAF50',
      name: m.plant.name_ro,
      nameLatin: m.plant.name_latin,
      confidence: Math.round(m.ai_confidence * 100),
      comment: m.comment || '',
      date: new Date(m.created_at).toLocaleDateString('ro-RO'),
    }))
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    #map { width: 100vw; height: 100vh; }
    .custom-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .marker-pin {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    }
    .marker-label {
      margin-top: 2px;
      font-size: 9px;
      font-weight: 600;
      color: #212121;
      background: rgba(255,255,255,0.9);
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      max-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    .popup-title { font-weight: 700; color: #1B5E20; margin-bottom: 4px; font-size: 14px; }
    .popup-latin { font-style: italic; color: #757575; font-size: 12px; margin-bottom: 6px; }
    .popup-row { font-size: 12px; color: #212121; margin-bottom: 2px; }
    .popup-row span { color: #757575; }
    .popup-comment { font-size: 11px; color: #757575; font-style: italic; margin-top: 4px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false
    }).setView([45.4353, 28.008], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
      minZoom: 10
    }).addTo(map);

    var markers = ${markersJson};

    markers.forEach(function(m) {
      var icon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin" style="background:' + m.color + '"></div>'
             + '<div class="marker-label">' + m.name + '</div>',
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -40]
      });

      var comment = m.comment.length > 80 ? m.comment.substring(0, 80) + '...' : m.comment;

      var popup = '<div class="popup-title">' + m.name + '</div>'
        + '<div class="popup-latin">' + m.nameLatin + '</div>'
        + '<div class="popup-row"><span>Siguranta: </span>' + m.confidence + '%</div>'
        + '<div class="popup-row"><span>Data: </span>' + m.date + '</div>'
        + (comment ? '<div class="popup-comment">' + comment + '</div>' : '');

      L.marker([m.lat, m.lng], { icon: icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 220 });
    });

    window.flyTo = function(lat, lng, zoom) {
      map.flyTo([lat, lng], zoom || 15, { duration: 0.8 });
    };

    document.addEventListener('message', function(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'flyTo') window.flyTo(msg.lat, msg.lng, msg.zoom);
      } catch(err) {}
    });
    window.addEventListener('message', function(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'flyTo') window.flyTo(msg.lat, msg.lng, msg.zoom);
      } catch(err) {}
    });
  </script>
</body>
</html>`;
}

const InteractiveMap = forwardRef<MapRef, InteractiveMapProps>(
  ({ markers }, ref) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number, zoom?: number) => {
        webViewRef.current?.postMessage(
          JSON.stringify({ type: 'flyTo', lat, lng, zoom: zoom ?? 15 })
        );
      },
    }));

    const html = buildHtml(markers);

    return (
      <View style={mapStyles.container}>
        <WebView
          ref={webViewRef}
          source={{ html }}
          style={mapStyles.map}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
);

export default InteractiveMap;
