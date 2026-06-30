'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

interface Props {
  location: { lat: number; lng: number; address: string };
  onChange: (loc: { lat: number; lng: number; address: string }) => void;
}

function MapClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onChange(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

export default function MapPicker({ location, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Current Location' }),
        () => {}
      );
    }
  };

  const icon = typeof window !== 'undefined' ? L.divIcon({
    className: 'custom-marker',
    html: '<div style="width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 15px rgba(59,130,246,0.5)"></div>',
    iconAnchor: [16, 32],
  }) : undefined;

  if (!mounted) return <div className="h-64 bg-dark-800 rounded-xl animate-pulse" />;

  return (
    <div className="relative">
      <div className="h-64 rounded-xl overflow-hidden border border-dark-700">
        <MapContainer center={[location.lat, location.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {icon && <Marker position={[location.lat, location.lng]} icon={icon} />}
          <MapClickHandler onChange={(lat, lng) => onChange({ lat, lng, address: location.address })} />
        </MapContainer>
      </div>
      <button
        onClick={handleGPS}
        className="absolute top-3 right-3 z-[500] flex items-center gap-2 px-3 py-2 glass rounded-lg text-sm text-white hover:bg-white/10 transition-all"
      >
        <Navigation size={14} className="text-blue-400" /> Use GPS
      </button>
    </div>
  );
}
