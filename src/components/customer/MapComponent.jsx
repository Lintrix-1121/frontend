// src/components/customer/MapComponent.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapComponent = () => {
  const position = [0.3136, 32.5811];
  
  const roadLabels = [
    { name: "Kampala Entebbe Express way", lat: 0.314, lng: 32.578 },
    { name: "Nakawuka-Kawuku Rd", lat: 0.316, lng: 32.582 },
    { name: "Mpigi Rd", lat: 0.312, lng: 32.584 },
    { name: "Nyarugusu Rd", lat: 0.311, lng: 32.579 },
    { name: "Mbarara Rd", lat: 0.315, lng: 32.576 },
    { name: "Kabalee Rd", lat: 0.317, lng: 32.580 },
    { name: "Kibale Rd", lat: 0.310, lng: 32.581 },
    { name: "Kisoro Rd", lat: 0.313, lng: 32.575 },
    { name: "Sironje Rd", lat: 0.318, lng: 32.583 },
    { name: "Jinja Rd", lat: 0.314, lng: 32.585 },
  ];

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      .road-label {
        background: rgba(40, 167, 69, 0.95) !important;
        padding: 4px 10px !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        color: white !important;
        text-align: center !important;
        white-space: nowrap !important;
        font-family: 'Segoe UI', system-ui, sans-serif !important;
        backdropFilter: 'blur(5px)',
      }
      .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.95) !important;
        backdropFilter: blur(10px) !important;
        border: 1px solid rgba(40, 167, 69, 0.2) !important;
        boxShadow: 0 10px 30px rgba(0,0,0,0.15) !important;
      }
      .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95) !important;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const customIcon = L.divIcon({
    html: `<div style="background: linear-gradient(135deg, #28a745, #20c997); 
                    width: 50px; 
                    height: 50px; 
                    border-radius: 0; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    border: 2px solid white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <i class="bi bi-geo-alt-fill"></i>
          </div>`,
    className: 'custom-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });

  return (
    <div style={{ position: 'relative' }}>
      {/* Glass overlay at the top of map */}
      <div 
        className="position-absolute top-0 start-0 w-100"
        style={{
          height: '5px',
          background: 'linear-gradient(to bottom, rgba(40,167,69,0.3), transparent)',
          zIndex: 1000,
          pointerEvents: 'none'
        }}
      />
      
      <MapContainer 
        center={position} 
        zoom={14} 
        style={{ height: '450px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="p-3 text-center" style={{ minWidth: '220px' }}>
              <div 
                className="p-2 d-inline-flex mb-2"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  border: '1px solid rgba(40, 167, 69, 0.2)'
                }}
              >
                <i className="bi bi-geo-alt" style={{ color: '#28a745' }}></i>
              </div>
              <h6 className="fw-bold mb-1" style={{ color: '#28a745' }}>SynerPhix Offices</h6>
              <p className="text-muted mb-2 small">
                Mall, Kawuku-Nakawuka Road<br />
                Entebbe, Uganda
              </p>
              <button 
                className="btn btn-sm"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  border: '1px solid rgba(40, 167, 69, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#28a745';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(40, 167, 69, 0.1)';
                  e.target.style.color = '#28a745';
                }}
              >
                <i className="bi bi-compass me-1"></i> Get Directions
              </button>
            </div>
          </Popup>
        </Marker>
        
        {roadLabels.map((road, index) => (
          <Marker 
            key={index} 
            position={[road.lat, road.lng]}
            icon={L.divIcon({
              html: `<div class="road-label">${road.name}</div>`,
              className: 'road-label-marker',
              iconSize: [road.name.length * 8 + 20, 28]
            })}
            interactive={false}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

