'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { Issue, getCategoryIcon } from '@/lib/mockData';

interface Props {
  issues: Issue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function IssueMap({ issues, selectedId, onSelect }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="flex-1 bg-dark-900 animate-pulse" />;

  const getColor = (issue: Issue) => {
    if (issue.status === 'Completed') return '#22c55e';
    if (issue.status === 'In Progress' || issue.status === 'Assigned') return '#eab308';
    return '#ef4444';
  };

  const getRadius = (severity: string) => {
    if (severity === 'Critical') return 14;
    if (severity === 'High') return 11;
    if (severity === 'Medium') return 9;
    return 7;
  };

  return (
    <MapContainer
      center={[19.076, 72.8777]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {issues.map(issue => (
        <CircleMarker
          key={issue.id}
          center={[issue.location.lat, issue.location.lng]}
          radius={getRadius(issue.severity)}
          pathOptions={{
            fillColor: getColor(issue),
            fillOpacity: selectedId === issue.id ? 1 : 0.75,
            color: selectedId === issue.id ? '#fff' : getColor(issue),
            weight: selectedId === issue.id ? 3 : 1.5,
          }}
          eventHandlers={{ click: () => onSelect(issue.id) }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
            <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 10px', color: '#f1f5f9', fontSize: '12px', minWidth: '160px' }}>
              <div style={{ fontWeight: 600, marginBottom: 3 }}>{getCategoryIcon(issue.category as any)} {issue.category}</div>
              <div style={{ color: '#94a3b8', fontSize: 11 }}>{issue.title.slice(0, 40)}...</div>
              <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                <span style={{ color: getColor(issue), fontWeight: 600, fontSize: 11 }}>● {issue.status}</span>
                <span style={{ color: '#64748b', fontSize: 11 }}>• {issue.severity}</span>
              </div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
