import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import { MapPin, Navigation, Search, Recycle, TreePine, Sprout, BookOpen } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5, // Duration of the animation in seconds
    });
  }, [center, zoom, map]);
  return null;
}


export interface Location {
  id: number;
  name: string;
  type: string;
  category: 'composting' | 'recycling' | 'workshop' | 'garden';
  coordinates: [number, number];
  address: string;
  city: string;
  state: string;
  zip: string;
  website?: string;
  phone?: string;
  materials?: string[];
  workshops?: string[];
  produce?: string[];
  description: string;
}

const locations: Location[] = [
  // Composting Facilities
  {
    id: 1,
    name: "Green Earth Composting",
    type: "Composting Facility",
    category: "composting",
    coordinates: [37.7749, -122.4194],
    address: "501 Tunnel Avenue",
    city: "San Francisco",
    state: "CA",
    zip: "94134",
    website: "https://www.greenearthcompost.com",
    phone: "(415) 330-1300",
    materials: ["Food scraps", "Yard waste", "Plant materials", "Compostable packaging"],
    description: "Large-scale composting facility serving San Francisco"
  },
  {
    id: 2,
    name: "Bay Area Composting Hub",
    type: "Composting Center",
    category: "composting",
    coordinates: [37.8044, -122.2711],
    address: "123 Compost Way",
    city: "Oakland",
    state: "CA",
    zip: "94612",
    materials: ["Food waste", "Green waste", "Agricultural waste"],
    description: "Community composting center with education programs"
  },
  {
    id: 3,
    name: "Peninsula Composting Co",
    type: "Composting Facility",
    category: "composting",
    coordinates: [37.4419, -122.1430],
    address: "789 Eco Drive",
    city: "Palo Alto",
    state: "CA",
    zip: "94301",
    materials: ["Organic waste", "Yard trimmings", "Food scraps"],
    description: "Peninsula's premier composting facility"
  },
  {
    id: 4,
    name: "South Bay Composters",
    type: "Composting Center",
    category: "composting",
    coordinates: [37.3382, -121.8863],
    address: "456 Green Street",
    city: "San Jose",
    state: "CA",
    zip: "95112",
    materials: ["Commercial food waste", "Residential green waste"],
    description: "Serving South Bay's composting needs"
  },
  {
    id: 5,
    name: "Marin Compost Collective",
    type: "Community Composting",
    category: "composting",
    coordinates: [37.9735, -122.5311],
    address: "321 Earth Lane",
    city: "San Rafael",
    state: "CA",
    zip: "94901",
    materials: ["Community garden waste", "Food scraps", "Yard waste"],
    description: "Community-driven composting initiative"
  },
  {
    id: 6,
    name: "Berkeley Composting Center",
    type: "Municipal Composting",
    category: "composting",
    coordinates: [37.8715, -122.2730],
    address: "567 Compost Road",
    city: "Berkeley",
    state: "CA",
    zip: "94710",
    materials: ["Municipal green waste", "Food waste", "Yard trimmings"],
    description: "Berkeley's municipal composting facility"
  },

  // Recycling Centers
  {
    id: 7,
    name: "EcoRecycle SF",
    type: "Recycling Center",
    category: "recycling",
    coordinates: [37.7790, -122.4190],
    address: "789 Recycling Way",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    materials: ["Electronics", "Plastics", "Paper", "Metal"],
    description: "Full-service recycling center"
  },
  {
    id: 8,
    name: "Oakland Recyclers",
    type: "Recycling Facility",
    category: "recycling",
    coordinates: [37.8040, -122.2711],
    address: "456 Green Street",
    city: "Oakland",
    state: "CA",
    zip: "94612",
    materials: ["Construction waste", "Household recyclables"],
    description: "Oakland's largest recycling facility"
  },
  {
    id: 9,
    name: "Peninsula Recycling Co",
    type: "Recycling Center",
    category: "recycling",
    coordinates: [37.4419, -122.1430],
    address: "123 Eco Avenue",
    city: "Palo Alto",
    state: "CA",
    zip: "94301",
    materials: ["Mixed recyclables", "E-waste", "Hazardous materials"],
    description: "Comprehensive recycling services"
  },
  {
    id: 10,
    name: "South Bay Recycling",
    type: "Recycling Facility",
    category: "recycling",
    coordinates: [37.3382, -121.8863],
    address: "789 Recovery Road",
    city: "San Jose",
    state: "CA",
    zip: "95112",
    materials: ["Industrial recycling", "Consumer recyclables"],
    description: "Industrial and consumer recycling center"
  },
  {
    id: 11,
    name: "Marin Recyclers",
    type: "Community Recycling",
    category: "recycling",
    coordinates: [37.9735, -122.5311],
    address: "456 Earth Way",
    city: "San Rafael",
    state: "CA",
    zip: "94901",
    materials: ["Community recycling", "Special materials"],
    description: "Community-focused recycling center"
  },
  {
    id: 12,
    name: "Berkeley Recycling",
    type: "Municipal Recycling",
    category: "recycling",
    coordinates: [37.8715, -122.2730],
    address: "321 Recovery Lane",
    city: "Berkeley",
    state: "CA",
    zip: "94710",
    materials: ["Municipal recycling", "Special waste"],
    description: "Berkeley's primary recycling facility"
  },

  // Sustainability Workshops
  {
    id: 13,
    name: "EcoLearning Center",
    type: "Education Center",
    category: "workshop",
    coordinates: [37.7749, -122.4194],
    address: "123 Workshop Way",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    workshops: ["Composting 101", "Zero Waste Living", "Sustainable Gardening"],
    description: "Environmental education hub"
  },
  {
    id: 14,
    name: "Green Skills Institute",
    type: "Training Center",
    category: "workshop",
    coordinates: [37.8044, -122.2711],
    address: "456 Learning Lane",
    city: "Oakland",
    state: "CA",
    zip: "94612",
    workshops: ["Renewable Energy", "Sustainable Building", "Eco-friendly Living"],
    description: "Professional sustainability training"
  },
  {
    id: 15,
    name: "Sustainability Academy",
    type: "Education Center",
    category: "workshop",
    coordinates: [37.4419, -122.1430],
    address: "789 Knowledge Road",
    city: "Palo Alto",
    state: "CA",
    zip: "94301",
    workshops: ["Climate Action", "Green Technology", "Sustainable Business"],
    description: "Advanced sustainability education"
  },
  {
    id: 16,
    name: "EcoWorkshop Hub",
    type: "Community Center",
    category: "workshop",
    coordinates: [37.3382, -121.8863],
    address: "321 Training Street",
    city: "San Jose",
    state: "CA",
    zip: "95112",
    workshops: ["Urban Farming", "Waste Reduction", "Green Living"],
    description: "Community sustainability workshops"
  },
  {
    id: 17,
    name: "Green Living Institute",
    type: "Education Center",
    category: "workshop",
    coordinates: [37.9735, -122.5311],
    address: "567 Eco Lane",
    city: "San Rafael",
    state: "CA",
    zip: "94901",
    workshops: ["Sustainable Home", "Green Transportation", "Eco-Crafting"],
    description: "Practical sustainability education"
  },
  {
    id: 18,
    name: "Eco Education Center",
    type: "Training Facility",
    category: "workshop",
    coordinates: [37.8715, -122.2730],
    address: "890 Learning Way",
    city: "Berkeley",
    state: "CA",
    zip: "94710",
    workshops: ["Environmental Science", "Sustainable Design", "Green Energy"],
    description: "Academic sustainability programs"
  },

  // Organic Gardens
  {
    id: 19,
    name: "Urban Roots Garden",
    type: "Community Garden",
    category: "garden",
    coordinates: [37.7833, -122.4167],
    address: "123 Garden Way",
    city: "San Francisco",
    state: "CA",
    zip: "94110",
    produce: ["Seasonal vegetables", "Herbs", "Flowers"],
    description: "Urban community garden"
  },
  {
    id: 20,
    name: "Oakland Organic Farm",
    type: "Urban Farm",
    category: "garden",
    coordinates: [37.8040, -122.2711],
    address: "456 Farm Road",
    city: "Oakland",
    state: "CA",
    zip: "94612",
    produce: ["Organic vegetables", "Fruits", "Herbs"],
    description: "Organic urban farming center"
  },
  {
    id: 21,
    name: "Peninsula Gardens",
    type: "Community Garden",
    category: "garden",
    coordinates: [37.4419, -122.1430],
    address: "789 Growth Lane",
    city: "Palo Alto",
    state: "CA",
    zip: "94301",
    produce: ["Local produce", "Native plants", "Medicinal herbs"],
    description: "Peninsula's organic garden hub"
  },
  {
    id: 22,
    name: "South Bay Organics",
    type: "Urban Farm",
    category: "garden",
    coordinates: [37.3382, -121.8863],
    address: "321 Organic Way",
    city: "San Jose",
    state: "CA",
    zip: "95112",
    produce: ["Vegetables", "Microgreens", "Edible flowers"],
    description: "South Bay's organic farming center"
  },
  {
    id: 23,
    name: "Marin Community Garden",
    type: "Community Garden",
    category: "garden",
    coordinates: [37.9735, -122.5311],
    address: "567 Growth Street",
    city: "San Rafael",
    state: "CA",
    zip: "94901",
    produce: ["Seasonal produce", "Heritage vegetables", "Herbs"],
    description: "Marin's community growing space"
  },
  {
    id: 24,
    name: "Berkeley Urban Farm",
    type: "Urban Farm",
    category: "garden",
    coordinates: [37.8715, -122.2730],
    address: "890 Farm Lane",
    city: "Berkeley",
    state: "CA",
    zip: "94710",
    produce: ["Organic vegetables", "Fruit trees", "Educational plots"],
    description: "Berkeley's educational farm"
  }
];

// Export locations as composterLocations for use in gemini.ts
export const composterLocations = locations;

const Map: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'composting' | 'recycling' | 'workshop' | 'garden'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = locations.filter(location => {
    const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'composting':
        return <Recycle className="h-6 w-6 text-green-400" />;
      case 'recycling':
        return <TreePine className="h-6 w-6 text-green-400" />;
      case 'workshop':
        return <BookOpen className="h-6 w-6 text-green-400" />;
      case 'garden':
        return <Sprout className="h-6 w-6 text-green-400" />;
      default:
        return <MapPin className="h-6 w-6 text-green-400" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-4">
          <MapPin className="h-8 w-8 text-green-400" />
          Bay Area Sustainability Map
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or city..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
          >
            <option value="all">All Locations</option>
            <option value="composting">Composting Facilities</option>
            <option value="recycling">Recycling Centers</option>
            <option value="workshop">Sustainability Workshops</option>
            <option value="garden">Organic Gardens</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div style={{ height: '600px', width: '100%' }} className="relative">
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.coordinates}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.type}</p>
                    <p className="text-sm">{location.address}</p>
                    <p className="text-sm">{`${location.city}, ${location.state} ${location.zip}`}</p>
                    {location.phone && <p className="text-sm">Phone: {location.phone}</p>}
                    {location.website && (
                      <a
                        href={location.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-400 hover:text-green-500"
                      >
                        Visit Website
                      </a>
                    )}
                    <p className="text-sm mt-2">{location.description}</p>
                    {location.materials && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold">Accepted Materials:</p>
                        <ul className="text-sm list-disc list-inside">
                          {location.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {location.workshops && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold">Available Workshops:</p>
                        <ul className="text-sm list-disc list-inside">
                          {location.workshops.map((workshop, index) => (
                            <li key={index}>{workshop}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {location.produce && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold">Available Produce:</p>
                        <ul className="text-sm list-disc list-inside">
                          {location.produce.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <div key={location.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-xl mb-2">{location.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{location.type}</p>
              </div>
              {getCategoryIcon(location.category)}
            </div>
            <p className="text-sm mb-2">
              {location.address}<br />
              {location.city}, {location.state} {location.zip}
            </p>
            {location.phone && (
              <p className="text-sm mb-2">
                📞 <a href={`tel:${location.phone}`} className="text-green-400 hover:text-green-500">{location.phone}</a>
              </p>
            )}
            {location.website && (
              <p className="text-sm mb-2">
                🌐 <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-500">Visit Website</a>
              </p>
            )}
            <p className="text-sm text-gray-600 mb-4">{location.description}</p>
            {location.materials && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Accepted Materials:</p>
                <ul className="text-sm list-disc list-inside">
                  {location.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            )}
            {location.workshops && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Available Workshops:</p>
                <ul className="text-sm list-disc list-inside">
                  {location.workshops.map((workshop, index) => (
                    <li key={index}>{workshop}</li>
                  ))}
                </ul>
              </div>
            )}
            {location.produce && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Available Produce:</p>
                <ul className="text-sm list-disc list-inside">
                  {location.produce.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;