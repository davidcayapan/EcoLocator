import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Scale, Recycle, TreePine, BarChart3, AlertTriangle, Info, Building2, Factory, User } from 'lucide-react';
import Comments from '../components/Comments';

interface ImpactMetrics {
  monthlyWaste: number;
  yearlyWaste: number;
  treesNeeded: number;
  landfillSpace: number;
  co2Emissions: number;
}

export default function Produce() {
  const { userRole, companyName, facilityName, userName } = useUser();
  const [wasteVolume, setWasteVolume] = useState<number>(0);
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    monthlyWaste: 0,
    yearlyWaste: 0,
    treesNeeded: 0,
    landfillSpace: 0,
    co2Emissions: 0
  });

  // Constants for calculations
  const WASTE_DENSITY = 0.15; // tons per cubic meter
  const CO2_PER_TON = 2.5; // metric tons of CO2 per ton of waste
  const TREES_PER_TON = 17; // trees needed to offset 1 ton of waste CO2

  useEffect(() => {
    // Calculate impact metrics
    const calculateImpact = (dailyWaste: number) => {
      const monthlyWaste = dailyWaste * 30;
      const yearlyWaste = monthlyWaste * 12;
      const landfillSpace = yearlyWaste / WASTE_DENSITY;
      const co2Emissions = yearlyWaste * CO2_PER_TON;
      const treesNeeded = Math.ceil(yearlyWaste * TREES_PER_TON);

      setMetrics({
        monthlyWaste: Number(monthlyWaste.toFixed(2)),
        yearlyWaste: Number(yearlyWaste.toFixed(2)),
        treesNeeded,
        landfillSpace: Number(landfillSpace.toFixed(2)),
        co2Emissions: Number(co2Emissions.toFixed(2))
      });
    };

    calculateImpact(wasteVolume);
  }, [wasteVolume]);

  const getUserIcon = () => {
    if (!userRole || userRole === 'guest') return <User className="h-6 w-6 text-gray-600" />;
    if (userRole === 'horeca') return <Building2 className="h-6 w-6 text-blue-600" />;
    return <Factory className="h-6 w-6 text-green-600" />;
  };

  const getUserDisplayName = () => {
    if (!userRole || userRole === 'guest') return 'Guest';
    if (userRole === 'horeca') return companyName;
    return facilityName;
  };

  const getUserTypeLabel = () => {
    if (!userRole || userRole === 'guest') return 'Guest User';
    if (userRole === 'horeca') return 'HoReCa Business';
    return 'Composting Facility';
  };

  const renderMetricCard = (
    title: string,
    value: number,
    unit: string,
    icon: React.ReactNode,
    description: string
  ) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{value.toLocaleString()}</span>
            <span className="text-gray-600">{unit}</span>
          </div>
        </div>
        <div className="text-green-600">{icon}</div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Waste Impact Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {userRole === 'facility' 
            ? "Track your facility's environmental impact and contribution to sustainability"
            : userRole === 'horeca'
            ? "Monitor your business's waste management and environmental footprint"
            : "Understand your waste footprint and environmental impact"
          }
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gray-100 rounded-full">
            {getUserIcon()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {getUserDisplayName()}
            </h2>
            <p className="text-sm text-gray-600">
              {getUserTypeLabel()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Waste Volume (kg)
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={wasteVolume}
              onChange={(e) => setWasteVolume(Number(e.target.value))}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              step="0.1"
              placeholder="Enter your daily waste volume"
            />
            <div className="relative group">
              <Info className="h-5 w-5 text-gray-400 cursor-help" />
              <div className="absolute right-0 w-64 bg-white p-3 rounded-lg shadow-lg invisible group-hover:visible z-10 text-sm text-gray-600">
                Enter your average daily waste production in kilograms. This helps calculate your environmental impact.
              </div>
            </div>
          </div>
        </div>

        {wasteVolume > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderMetricCard(
              "Monthly Waste",
              metrics.monthlyWaste,
              "kg",
              <Scale className="h-6 w-6" />,
              "Total waste generated over a 30-day period"
            )}
            {renderMetricCard(
              "Yearly Waste",
              metrics.yearlyWaste,
              "kg",
              <BarChart3 className="h-6 w-6" />,
              "Projected annual waste generation"
            )}
            {renderMetricCard(
              "Trees Needed",
              metrics.treesNeeded,
              "trees",
              <TreePine className="h-6 w-6" />,
              "Number of trees needed to offset CO2 emissions"
            )}
            {renderMetricCard(
              "Landfill Space",
              metrics.landfillSpace,
              "m³",
              <Recycle className="h-6 w-6" />,
              "Volume of landfill space required annually"
            )}
            {renderMetricCard(
              "CO2 Emissions",
              metrics.co2Emissions,
              "metric tons",
              <AlertTriangle className="h-6 w-6" />,
              "Annual carbon dioxide emissions from waste"
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Enter your daily waste volume to see your environmental impact metrics
          </div>
        )}
      </div>

      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reduction Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Short-term Actions</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Implement proper waste segregation</li>
              <li>Use reusable containers and bags</li>
              <li>Start composting organic waste</li>
              <li>Reduce single-use items</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Long-term Strategies</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Invest in waste reduction equipment</li>
              <li>Partner with recycling facilities</li>
              <li>Train staff in waste management</li>
              <li>Set waste reduction goals</li>
            </ul>
          </div>
        </div>
      </div>

      <Comments articleId="waste-impact-calculator" />
    </div>
  );
}