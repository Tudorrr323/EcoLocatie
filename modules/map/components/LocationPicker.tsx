// LocationPicker — componenta full-screen pentru selectarea manuala a unei locatii pe harta.
// Afiseaza un pin fix in centrul hartii cu coordonate actualizate in timp real la miscare.
// Pin-ul are animatie de ridicare la miscare si de asezare (drop) la oprire.

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import Svg, { Path, Circle } from 'react-native-svg';
import { X, Check } from 'lucide-react-native';
import { createMapStyles } from '../styles/map.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { useTranslation } from '../../../shared/i18n';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  visible: boolean;
  initialCoordinates?: Coordinates;
  userLocation?: Coordinates;
  onConfirm: (coordinates: Coordinates) => void;
  onClose: () => void;
}

function buildPickerHtml(initial?: Coordinates, userLocation?: Coordinates): string {
  const lat = initial?.latitude ?? userLocation?.latitude ?? 45.4353;
  const lng = initial?.longitude ?? userLocation?.longitude ?? 28.008;
  const zoom = (initial || userLocation) ? 16 : 13;

  const userLocJs = userLocation
    ? `
    var userIcon = L.divIcon({
      className: '',
      html: '<div style="width:16px;height:16px;background:#4285F4;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 5px rgba(66,133,244,0.25),0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    L.marker([${userLocation.latitude}, ${userLocation.longitude}], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    `
    : '';

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

    ${userLocJs}

    function sendCenter() {
      var c = map.getCenter();
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'coords', lat: c.lat, lng: c.lng }));
    }

    map.on('movestart', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'movestart' }));
    });

    map.on('move', sendCenter);

    map.on('moveend', function() {
      sendCenter();
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'moveend' }));
    });

    sendCenter();
  </script>
</body>
</html>`;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  initialCoordinates,
  userLocation,
  onConfirm,
  onClose,
}) => {
  const colors = useThemeColors();
  const t = useTranslation();
  const mapStyles = useMemo(() => createMapStyles(colors), [colors]);
  const [coords, setCoords] = useState<Coordinates>(
    initialCoordinates ?? userLocation ?? { latitude: 45.4353, longitude: 28.008 },
  );

  const pinTranslateY = useRef(new Animated.Value(0)).current;
  const pinScale = useRef(new Animated.Value(1)).current;
  const shadowScale = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(1)).current;
  const isMoving = useRef(false);

  // Reset animations when modal opens
  useEffect(() => {
    if (visible) {
      pinTranslateY.setValue(0);
      pinScale.setValue(1);
      shadowScale.setValue(1);
      shadowOpacity.setValue(1);
    }
  }, [visible]);

  const animateLift = useCallback(() => {
    if (isMoving.current) return;
    isMoving.current = true;
    Animated.parallel([
      Animated.spring(pinTranslateY, {
        toValue: -16,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
      }),
      Animated.spring(pinScale, {
        toValue: 1.15,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
      }),
      Animated.timing(shadowScale, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.4,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pinTranslateY, pinScale, shadowScale, shadowOpacity]);

  const animateDrop = useCallback(() => {
    isMoving.current = false;
    Animated.parallel([
      Animated.spring(pinTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 12,
      }),
      Animated.spring(pinScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 12,
      }),
      Animated.spring(shadowScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 8,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pinTranslateY, pinScale, shadowScale, shadowOpacity]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'coords' && data.lat != null && data.lng != null) {
        setCoords({ latitude: data.lat, longitude: data.lng });
      } else if (data.type === 'movestart') {
        animateLift();
      } else if (data.type === 'moveend') {
        animateDrop();
      }
    } catch {}
  }, [animateLift, animateDrop]);

  const handleConfirm = useCallback(() => {
    onConfirm(coords);
  }, [coords, onConfirm]);

  const html = buildPickerHtml(initialCoordinates, userLocation);

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={mapStyles.locationPickerContainer}>
        {/* Coordonate sus */}
        <View style={mapStyles.locationPickerHeader}>
          <TouchableOpacity onPress={onClose} style={mapStyles.locationPickerCloseButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={mapStyles.locationPickerCoordsBox}>
            <Text style={mapStyles.locationPickerCoordsLabel}>{t.map.locationPicker.latitude}</Text>
            <Text style={mapStyles.locationPickerCoordsValue}>
              {coords.latitude.toFixed(6)}
            </Text>
          </View>
          <View style={mapStyles.locationPickerCoordsBox}>
            <Text style={mapStyles.locationPickerCoordsLabel}>{t.map.locationPicker.longitude}</Text>
            <Text style={mapStyles.locationPickerCoordsValue}>
              {coords.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        {/* Harta */}
        <View style={{ flex: 1 }}>
          <WebView
            source={{ html }}
            style={mapStyles.locationPickerMap}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            onMessage={handleMessage}
          />

          {/* Pin animat fix in centru */}
          <View style={mapStyles.centerPinContainer} pointerEvents="none">
            <Animated.View
              style={[
                mapStyles.centerPinShadow,
                {
                  transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
                  opacity: shadowOpacity,
                },
              ]}
            />
            <Animated.View
              style={{
                alignItems: 'center',
                transform: [{ translateY: pinTranslateY }, { scale: pinScale }],
              }}
            >
              <Svg width={40} height={52} viewBox="0 0 40 52">
                <Path
                  d="M20 0C8.954 0 0 8.954 0 20c0 15 20 32 20 32s20-17 20-32C40 8.954 31.046 0 20 0z"
                  fill={colors.primary}
                  stroke="#fff"
                  strokeWidth={2.5}
                />
                <Circle cx={20} cy={19} r={8} fill="#fff" />
              </Svg>
            </Animated.View>
          </View>
        </View>

        {/* Buton confirmare */}
        <View style={mapStyles.locationPickerFooter}>
          <TouchableOpacity
            style={mapStyles.locationPickerConfirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Check size={20} color={colors.textLight} />
            <Text style={mapStyles.locationPickerConfirmButtonText}>
              {t.map.locationPicker.confirmLocation}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPicker;
