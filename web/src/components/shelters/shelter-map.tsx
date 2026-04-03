'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shelter } from '@/lib/api';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ShelterMapProps {
  shelters: Shelter[];
  onMarkerClick: (shelter: Shelter) => void;
  onMapClick: (lat: number, lng: number) => void;
}

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function ShelterMap({ shelters, onMarkerClick, onMapClick }: ShelterMapProps) {
  const center: [number, number] = [52.52, 13.405];

  return (
    <MapContainer 
      center={center} 
      zoom={10} 
      style={{ height: '100%', width: '100%', background: '#000' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {shelters.map((s) => (
        <Marker 
          key={s.id} 
          position={[s.lat, s.lng]}
          eventHandlers={{
            click: () => onMarkerClick(s),
          }}
        >
          <Popup>
             <div className="font-black uppercase tracking-tighter italic text-lg">{s.name}</div>
             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.type}</div>
          </Popup>
        </Marker>
      ))}

      <MapEvents onMapClick={onMapClick} />
    </MapContainer>
  );
}
