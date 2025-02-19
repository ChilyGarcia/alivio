import React from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";

const MapLocation = ({ markers, center, iconUrl = "/images/marker-locations.png" }) => {
  const defaultIcon = new L.Icon({
    iconUrl: iconUrl,
    iconSize: [20, 20],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const safeMarkers = Array.isArray(markers) ? markers : [markers];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {safeMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.latitude, marker.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ __html: marker.popupContent }} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapLocation;
