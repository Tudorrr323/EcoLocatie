import React, { useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { mapStyles } from '../styles/map.styles';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  initialCoordinates?: Coordinates;
  onConfirm: (coordinates: Coordinates) => void;
}

function buildPickerHtml(initial?: Coordinates): string {
  const lat = initial?.latitude ?? 45.4353;
  const lng = initial?.longitude ?? 28.008;
  const zoom = initial ? 16 : 13;
  const hasInitial = !!initial;

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
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], ${zoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
      minZoom: 10
    }).addTo(map);

    var marker = null;
    ${hasInitial ? `
    marker = L.marker([${lat}, ${lng}], { draggable: true }).addTo(map);
    marker.on('dragend', function() {
      var pos = marker.getLatLng();
      window.ReactNativeWebView.postMessage(JSON.stringify({ lat: pos.lat, lng: pos.lng }));
    });
    ` : ''}

    map.on('click', function(e) {
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng, { draggable: true }).addTo(map);
        marker.on('dragend', function() {
          var pos = marker.getLatLng();
          window.ReactNativeWebView.postMessage(JSON.stringify({ lat: pos.lat, lng: pos.lng }));
        });
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng }));
    });
  </script>
</body>
</html>`;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialCoordinates,
  onConfirm,
}) => {
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(
    initialCoordinates ?? null
  );

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.lat != null && data.lng != null) {
        setSelectedCoords({ latitude: data.lat, longitude: data.lng });
      }
    } catch {}
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedCoords) {
      onConfirm(selectedCoords);
    }
  }, [selectedCoords, onConfirm]);

  const coordsLabel = selectedCoords
    ? `${selectedCoords.latitude.toFixed(5)}, ${selectedCoords.longitude.toFixed(5)}`
    : 'Apasa pe harta pentru a alege locatia';

  const html = buildPickerHtml(initialCoordinates);

  return (
    <View style={mapStyles.locationPickerContainer}>
      <WebView
        source={{ html }}
        style={mapStyles.locationPickerMap}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onMessage={handleMessage}
      />

      {!selectedCoords && (
        <View style={mapStyles.crosshairContainer} pointerEvents="none">
          <View style={mapStyles.crosshairHorizontal} />
          <View style={mapStyles.crosshairVertical} />
          <View style={mapStyles.crosshairDot} />
        </View>
      )}

      <View style={mapStyles.locationPickerFooter}>
        <Text style={mapStyles.locationPickerCoordsText}>{coordsLabel}</Text>
        <TouchableOpacity
          style={[
            mapStyles.locationPickerConfirmButton,
            !selectedCoords && mapStyles.locationPickerConfirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedCoords}
          activeOpacity={0.8}
        >
          <Text style={mapStyles.locationPickerConfirmButtonText}>
            Confirma locatia
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationPicker;
