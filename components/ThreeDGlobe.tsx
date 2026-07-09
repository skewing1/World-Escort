'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { X, Trophy, Shield, MapPin, Sparkles, Plus, Minus } from 'lucide-react';
import * as THREE from 'three';

// Dynamically import Globe to avoid SSR (Server Side Rendering) errors in Next.js
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

// --- TYPES ---
export interface GlobeProfile {
  id: string;
  name: string;
//   weightClass: string;
//   record: string;
//   kos: number;
}

export interface CountryGroup {
  countryCode: string;
  countryName: string;
  flag: string;
  lat: number;
  lng: number;
  profiles: GlobeProfile[];
}

// --- UTILITIES ---
function getCountryFlagInternal(codeOrName: string): string {
  // Note: In a real implementation, you could reuse your util 'src/utils/countries.tsx'
  // Here we leave a simple fallback so it compiles independently
  return '🏳️'; 
}

// --- MAIN COMPONENT ---
export const ThreeDGlobe: React.FC<{ countryGroups: CountryGroup[] }> = ({ countryGroups }) => {
  const globeEl = useRef<any>(null);
  const [countries, setCountries] = useState({ features: [] });
  const [selectedCountry, setSelectedCountry] = useState<CountryGroup | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<object | null>(null);
  const [recentNfts, setRecentNfts] = useState<any[]>([]);
  const [globeReady, setGlobeReady] = useState(false);

  // 1. Load geographic data (GeoJSON)
  useEffect(() => {
    // We use a low-resolution GeoJSON optimized for web
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  // 2. Polling for recent NFTs 
  useEffect(() => {
    const fetchLatestNfts = async () => {
      try {
        const res = await fetch('/api/nft/latest?limit=5');
        if (res.ok) {
          const { nfts } = await res.json();
          setRecentNfts(nfts);
        }
      } catch (e) {
        console.error('Error fetching latest NFTs', e);
      }
    };
    fetchLatestNfts();
    const interval = setInterval(fetchLatestNfts, 10000);
    return () => clearInterval(interval);
  }, []);

  // 3. Initial auto-rotation and Controls Configuration
  useEffect(() => {
    if (globeEl.current) {
      // Forced controls configuration
      const controls = globeEl.current.controls();
      controls.enableZoom = false;
      controls.enablePan = false; // Prevent center movement (off-centering)

      if (!selectedCountry) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
      } else {
        controls.autoRotate = false;
      }
    }
  }, [selectedCountry, globeReady]);

  // --- VISUALIZATION LOGIC ---

  // Quick map to search profile data by ISO code
  const countryDataMap = useMemo(() => {
    const map = new Map<string, CountryGroup>();
    countryGroups.forEach(g => map.set(g.countryCode, g));
    return map;
  }, [countryGroups]);

  // Determine country color
  const getPolygonColor = (d: any) => {
    // ISO_A3 is the standard in GeoJSON (e.g., 'USA', 'ARG')
    const countryCode = d.properties.ISO_A3;
    const hasProfiles = countryDataMap.has(countryCode);
    const isSelected = selectedCountry?.countryCode === countryCode;
    const isHovered = hoveredPolygon === d;

    if (isSelected) return '#60A5FA'; // Bright blue selected
    if (isHovered) return '#3B82F6';  // Medium blue hover
    if (hasProfiles) return '#1e3a8a'; // Dark blue if it has profiles
    return '#171732ff'; // Dark gray (Zinc 900) if it has nothing
  };

  // Determine country altitude (extrusion)
  const getPolygonAltitude = (d: any) => {
    const countryCode = d.properties.ISO_A3;
    const isSelected = selectedCountry?.countryCode === countryCode;
    const isHovered = hoveredPolygon === d;
    // Raise more if selected or hovered
    return isSelected ? 0.12 : (isHovered ? 0.08 : 0.01);
  };

  // Handle country click
  const handlePolygonClick = (d: any) => {
    const countryCode = d.properties.ISO_A3;
    const group = countryDataMap.get(countryCode);

    if (group) {
      // If country has profiles, select and focus
      setSelectedCountry(group);
      
      // Move camera towards country (approximate coordinates from GeoJSON or group)
      // Use group coords if exist, or centroid calculated by globe.gl
      if (globeEl.current) {
        globeEl.current.pointOfView({ lat: group.lat, lng: group.lng, altitude: 2 }, 1000);
      }
    } else {
        // If no profiles, deselect
        setSelectedCountry(null);
    }
  };

  // Manual Zoom Control
  const handleZoom = (direction: 'in' | 'out') => {
    if (!globeEl.current) return;
    const currentPOV = globeEl.current.pointOfView();
    // Adjust altitude: lower altitude = more zoom (closer)
    // Limits: min 0.5, max 10
    const newAltitude = direction === 'in'
      ? Math.max(0.5, currentPOV.altitude - 0.5)
      : Math.min(10, currentPOV.altitude + 0.5);

    globeEl.current.pointOfView({ ...currentPOV, altitude: newAltitude }, 400);
  };

  return (
    <div className="w-full h-full bg-black relative overflow-hidden rounded-xl border border-zinc-800 shadow-2xl">
      
      {/* 1. GLOBE COMPONENT */}
      <Globe
        ref={globeEl}
        onGlobeReady={() => setGlobeReady(true)}
        backgroundColor="rgba(0,0,0,0)" // Transparent to see CSS background if present
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Polygon Configuration (Countries)
        polygonsData={countries.features.filter((d: any) => d.properties.ISO_A3 !== 'AQ')} // Exclude Antarctica
        polygonAltitude={getPolygonAltitude}
        polygonCapColor={getPolygonColor}
        polygonSideColor={() => 'rgba(255, 255, 255, 0.05)'} // Subtle borders
        polygonStrokeColor={() => '#111'}
        polygonLabel={({ properties: d }: any) => `
          <div class="bg-black/90 text-white px-2 py-1 rounded border border-zinc-700 text-xs font-bold">
            ${d.ADMIN} (${d.ISO_A3})
            ${countryDataMap.has(d.ISO_A3) ? '<br/><span class="text-blue-400">Active League Nation</span>' : ''}
          </div>
        `}
        
        // Interaction
        onPolygonHover={setHoveredPolygon}
        onPolygonClick={handlePolygonClick}
        
        // Atmosphere configuration
        atmosphereColor="#3B82F6"
        atmosphereAltitude={0.15}
      />

      {/* 2. LAYER UI: Profile Panel (Same original design) */}
      {selectedCountry && (
        <div className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 z-20 w-72 md:w-80 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="bg-zinc-950/90 backdrop-blur-xl border border-blue-500/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                {/* Panel Header */}
                <div className="bg-gradient-to-r from-blue-900/60 to-zinc-900 p-4 border-b border-blue-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={selectedCountry.flag} width="36" height="36" className="drop-shadow-md" alt="Country flag" />
                        <div>
                            <h3 className="font-bold text-white text-lg leading-none">{selectedCountry.countryName}</h3>
                            <p className="text-[10px] text-blue-400 font-mono tracking-wider mt-1">NATIONAL ROSTER</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setSelectedCountry(null);
                            if(globeEl.current) globeEl.current.pointOfView({ altitude: 2.5 }, 1000); // Zoom out
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable List */}
                <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                    {selectedCountry.profiles.length > 0 ? (
                        <div className="space-y-1">
                            {selectedCountry.profiles.map((f, i) => (
                                <Link href={`/profiles/${f.id}`} key={f.id}>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group border border-transparent hover:border-blue-500/30">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-6 h-6 flex items-center justify-center bg-zinc-900 rounded text-[10px] text-zinc-500 font-mono">
                                            {i + 1}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition-colors truncate">
                                                {f.name}
                                            </p>
                                            {/* <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                                <Shield size={10} /> {f.weightClass.split('_')[0]} Division
                                            </p> */}
                                        </div>
                                    </div>
                                    {/* <div className="text-right pl-2">
                                        <div className="flex items-center gap-1 justify-end text-amber-500">
                                            <Trophy size={12} />
                                            <span className="text-sm font-bold">{f.kos}</span>
                                        </div>
                                        <p className="text-[8px] text-zinc-600 uppercase tracking-wider">Career KOs</p>
                                    </div> */}
                                </div>
                            </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 px-6 text-center text-zinc-400 flex flex-col items-center gap-3">
                            <div className="p-3 rounded-full bg-zinc-900/50 border border-zinc-700">
                                <MapPin size={28} className="opacity-60" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-300 mb-1">No Profiles Yet</p>
                                <p className="text-xs text-zinc-500">This nation hasn&apos;t registered any profiles in the Global League.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Panel Footer */}
                <div className="p-3 bg-zinc-900/50 border-t border-white/5 text-center">
                    <button className="text-[10px] text-blue-400 hover:text-blue-300 font-mono uppercase tracking-widest transition-colors">
                        View Full Country Stats &rarr;
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 3. LAYER UI: Static Overlay (Title, Feed) */}
      <div className="absolute top-6 left-6 pointer-events-none select-none z-10">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase opacity-90 drop-shadow-md">Global Intel</h2>
        <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs text-blue-400 font-mono font-bold">LIVE FEED</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 max-w-xs pointer-events-auto z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-xs text-violet-400 font-mono font-bold">RECENT ACHIEVEMENTS</span>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
          {recentNfts.length > 0 ? (
            recentNfts.map((nft) => (
              <div key={nft.id} className="flex items-center gap-2 p-2 bg-zinc-900/80 border border-violet-500/30 rounded-lg hover:border-violet-500/60 transition-all backdrop-blur-sm">
                <img src={nft.country ? countryDataMap.get(nft.country)?.flag || '🏳️' : '🏳️'} className="text-lg" alt="Country flag"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-violet-300 truncate">{nft.profileName}</p>
                  <p className="text-[10px] text-zinc-500">Performance NFT Minted</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-zinc-500 italic">Scanning blockchain...</p>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 flex flex-col gap-4 z-10 items-end">
        {/* Zoom Controls */}
        <div className="flex flex-col gap-2 pointer-events-auto">
            <button
            onClick={() => handleZoom('in')}
            className="p-2 bg-zinc-900/80 text-white rounded-full border border-zinc-700 hover:bg-zinc-800 hover:border-blue-500 transition-colors shadow-lg backdrop-blur-sm"
            aria-label="Zoom In"
            >
            <Plus size={20} />
            </button>
            <button
            onClick={() => handleZoom('out')}
            className="p-2 bg-zinc-900/80 text-white rounded-full border border-zinc-700 hover:bg-zinc-800 hover:border-blue-500 transition-colors shadow-lg backdrop-blur-sm"
            aria-label="Zoom Out"
            >
            <Minus size={20} />
            </button>
        </div>

        <p className="text-[10px] text-zinc-400 font-mono pointer-events-none select-none">CLICK NATIONS TO INSPECT</p>
      </div>
    </div>
  );
};