import React, { useState } from 'react';
import { 
  Recycle, 
  TreePine, 
  Thermometer, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Apple,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Globe2
} from 'lucide-react';
import Comments from '../components/Comments';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle }) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button
      className="w-full px-4 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      onClick={onToggle}
    >
      <span className="text-lg font-semibold text-gray-800">{title}</span>
      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </button>
    {isOpen && (
      <div className="px-4 py-4 bg-white">
        {children}
      </div>
    )}
  </div>
);

export default function Compost() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    composting: true,
    recycling: false,
    climate: false,
    sustainable: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Environmental Sustainability Guide</h1>
        <p className="text-lg text-gray-600">
          Learn about composting, recycling, and climate change to make a positive impact on our planet.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <AccordionItem 
          title="Home Composting Guide" 
          isOpen={openSections.composting}
          onToggle={() => toggleSection('composting')}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&q=80&w=800"
                alt="Composting bin"
                className="w-full md:w-1/3 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Getting Started with Composting</h3>
                <p className="text-gray-600 mb-4">
                  Composting is nature's way of recycling organic matter into nutrient-rich soil.
                  Here's how to start your composting journey.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What to Compost
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Fruit and vegetable scraps</li>
                  <li>Coffee grounds and filters</li>
                  <li>Eggshells</li>
                  <li>Yard trimmings</li>
                  <li>Grass clippings</li>
                  <li>Dry leaves</li>
                  <li>Shredded paper</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  What Not to Compost
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Meat or fish</li>
                  <li>Dairy products</li>
                  <li>Oils or fats</li>
                  <li>Diseased plants</li>
                  <li>Chemically treated wood</li>
                  <li>Pet waste</li>
                  <li>Glossy paper</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Composting Steps</h4>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Choose a dry, shady spot for your compost bin</li>
                <li>Layer brown materials (dry leaves, twigs) with green materials (grass clippings, food scraps)</li>
                <li>Maintain moisture similar to a wrung-out sponge</li>
                <li>Turn the pile regularly to provide aeration</li>
                <li>Monitor temperature - a warm (but not hot) pile indicates good decomposition</li>
              </ol>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem 
          title="Recycling Guide" 
          isOpen={openSections.recycling}
          onToggle={() => toggleSection('recycling')}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800"
                alt="Recycling bins"
                className="w-full md:w-1/3 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Proper Recycling Practices</h3>
                <p className="text-gray-600">
                  Effective recycling reduces landfill waste and conserves natural resources.
                  Learn how to recycle correctly and make a difference.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Paper & Cardboard</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Clean cardboard</li>
                  <li>✓ Office paper</li>
                  <li>✓ Newspapers</li>
                  <li>✗ Greasy pizza boxes</li>
                  <li>✗ Wax-coated paper</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Plastics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Bottles & containers</li>
                  <li>✓ Clean food packaging</li>
                  <li>✓ Rigid plastics</li>
                  <li>✗ Plastic bags</li>
                  <li>✗ Styrofoam</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Metal & Glass</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Aluminum cans</li>
                  <li>✓ Steel cans</li>
                  <li>✓ Glass bottles</li>
                  <li>✗ Mirrors</li>
                  <li>✗ Light bulbs</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Important Tips
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Rinse containers before recycling</li>
                <li>Remove caps and lids</li>
                <li>Flatten cardboard boxes</li>
                <li>Don't bag recyclables</li>
                <li>When in doubt, check local guidelines</li>
              </ul>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem 
          title="Climate Change Impact" 
          isOpen={openSections.climate}
          onToggle={() => toggleSection('climate')}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800"
                alt="Climate change effects"
                className="w-full md:w-1/3 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Understanding Climate Change</h3>
                <p className="text-gray-600">
                  Climate change is one of the most pressing challenges of our time.
                  Learn about its causes, effects, and what we can do to help.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Statistics</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Global temperature rise: 1.1°C since pre-industrial times</li>
                  <li>Sea level rise: 3.3mm per year</li>
                  <li>Arctic sea ice decline: 13% per decade</li>
                  <li>CO2 levels: Highest in 800,000 years</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Observable Effects</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>More frequent extreme weather events</li>
                  <li>Rising sea levels threatening coastal areas</li>
                  <li>Longer, more intense heat waves</li>
                  <li>Changes in precipitation patterns</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Individual Actions</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Use public transportation or bike</li>
                  <li>Reduce meat consumption</li>
                  <li>Choose energy-efficient appliances</li>
                  <li>Install solar panels if possible</li>
                </ul>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Support renewable energy initiatives</li>
                  <li>Reduce, reuse, recycle</li>
                  <li>Plant trees and support reforestation</li>
                  <li>Educate others about climate change</li>
                </ul>
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem 
          title="Sustainable Living Tips" 
          isOpen={openSections.sustainable}
          onToggle={() => toggleSection('sustainable')}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                alt="Sustainable living"
                className="w-full md:w-1/3 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Everyday Sustainability</h3>
                <p className="text-gray-600">
                  Small changes in our daily lives can make a big difference for the environment.
                  Here are practical tips for sustainable living.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">At Home</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Use LED light bulbs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Install a programmable thermostat
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Fix leaky faucets
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Use natural cleaning products
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Shopping & Food</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Bring reusable bags
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Buy local and seasonal produce
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Reduce packaging waste
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Plan meals to reduce food waste
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Long-term Investments</h4>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                <li className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-blue-600" />
                  Install solar panels
                </li>
                <li className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-blue-600" />
                  Purchase energy-efficient appliances
                </li>
                <li className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-blue-600" />
                  Improve home insulation
                </li>
                <li className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-blue-600" />
                  Consider an electric vehicle
                </li>
              </ul>
            </div>
          </div>
        </AccordionItem>
      </div>

      <div className="text-center text-gray-600 text-sm">
        <p>Data sources: EPA, IPCC, National Geographic, Environmental Defense Fund</p>
        <p className="mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <Comments articleId="environmental-sustainability-guide" />
    </div>
  );
}