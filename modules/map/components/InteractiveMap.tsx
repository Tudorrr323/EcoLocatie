// InteractiveMap — harta interactiva Leaflet randata intr-un WebView.
// Afiseaza markere colorate per planta, popup-uri cu detalii si locatia utilizatorului in timp real.
// Expune o referinta (MapRef) pentru flyTo() si updateUserLocation() din exterior.

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { MarkerData } from '../types/map.types';
import { mapStyles } from '../styles/map.styles';

export interface MapRef {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  updateUserLocation: (lat: number, lng: number) => void;
}

interface InteractiveMapProps {
  markers: MarkerData[];
  onUserDrag?: () => void;
  onMarkerTap?: (markerId: number) => void;
  onMapTap?: () => void;
  onMapReady?: () => void;
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
      cursor: pointer;
    }
    .marker-pin-svg {
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
    }
    .marker-label {
      margin-top: 1px;
      font-size: 9px;
      font-weight: 600;
      color: #212121;
      background: rgba(255,255,255,0.92);
      padding: 1px 5px;
      border-radius: 4px;
      white-space: nowrap;
      max-width: 72px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    .user-location {
      width: 18px;
      height: 18px;
      background: #4285F4;
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 6px rgba(66,133,244,0.25), 0 2px 6px rgba(0,0,0,0.3);
    }
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

    function pinSvg(color) {
      return '<svg class="marker-pin-svg" width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="' + color + '" stroke="#000" stroke-width="0.8" stroke-opacity="0.3"/>'
        + '<circle cx="14" cy="13" r="6" fill="#fff" opacity="0.9" stroke="#000" stroke-width="0.8" stroke-opacity="0.3"/>'
        + '</svg>';
    }

    markers.forEach(function(m) {
      var icon = L.divIcon({
        className: 'custom-marker',
        html: pinSvg(m.color) + '<div class="marker-label">' + m.name + '</div>',
        iconSize: [28, 42],
        iconAnchor: [14, 36],
      });

      L.marker([m.lat, m.lng], { icon: icon })
        .addTo(map)
        .on('click', function(e) {
          e.originalEvent._markerClicked = true;
          map.flyTo([m.lat, m.lng], Math.max(map.getZoom(), 15), { duration: 0.5 });
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'markerTap', id: m.id })
          );
        });
    });

    var userMarker = null;

    window.flyTo = function(lat, lng, zoom) {
      programmaticMove = true;
      map.flyTo([lat, lng], zoom || 15, { duration: 0.8 });
      map.once('moveend', function() { programmaticMove = false; });
    };

    window.updateUserLocation = function(lat, lng) {
      if (!userMarker) {
        var icon = L.divIcon({
          className: '',
          html: '<div class="user-location"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        userMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 1000 }).addTo(map);
      } else {
        userMarker.setLatLng([lat, lng]);
      }
    };

    function handleMessage(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'flyTo') window.flyTo(msg.lat, msg.lng, msg.zoom);
        if (msg.type === 'userLocation') window.updateUserLocation(msg.lat, msg.lng);
      } catch(err) {}
    }
    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);

    var programmaticMove = false;

    map.on('dragstart', function() {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'userDrag' }));
    });

    map.on('zoomstart', function() {
      if (!programmaticMove) {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'userDrag' }));
      }
    });

    map.on('click', function(e) {
      if (!e.originalEvent._markerClicked) {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapTap' }));
      }
    });
  </script>
</body>
</html>`;
}

const InteractiveMap = forwardRef<MapRef, InteractiveMapProps>(
  ({ markers, onUserDrag, onMarkerTap, onMapTap, onMapReady }, ref) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number, zoom?: number) => {
        webViewRef.current?.postMessage(
          JSON.stringify({ type: 'flyTo', lat, lng, zoom: zoom ?? 15 })
        );
      },
      updateUserLocation: (lat: number, lng: number) => {
        webViewRef.current?.postMessage(
          JSON.stringify({ type: 'userLocation', lat, lng })
        );
      },
    }));

    const html = buildHtml(markers);

    const handleWebViewMessage = (event: { nativeEvent: { data: string } }) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === 'userDrag' && onUserDrag) onUserDrag();
        if (msg.type === 'markerTap' && onMarkerTap) onMarkerTap(msg.id);
        if (msg.type === 'mapTap' && onMapTap) onMapTap();
      } catch {}
    };

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
          onMessage={handleWebViewMessage}
          onLoadEnd={onMapReady}
        />
      </View>
    );
  }
);

export default InteractiveMap;
