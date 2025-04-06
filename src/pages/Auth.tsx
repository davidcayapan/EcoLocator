import React, { useState } from 'react';
import { Leaf, Building2, Clock, MapPin, Scale, Calendar, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface AuthProps {
  onLogin: () => void;
}

type BusinessType = 'hotel' | 'restaurant' | 'cafe' | 'school' | 'company' | 'other';
type CollectionFrequency = 'daily' | 'alternate' | 'weekly' | 'custom';

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'provider' | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  // HORECA business fields
  const [organizationName, setOrganizationName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('restaurant');
  const [wasteVolume, setWasteVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState<'kg' | 'tons'>('kg');
  const [collectionFrequency, setCollectionFrequency] = useState<CollectionFrequency>('daily');
  const [customFrequency, setCustomFrequency] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [operatingHours, setOperatingHours] = useState('');

  // Composting facility fields
  const [facilityName, setFacilityName] = useState('');
  const [processingCapacity, setProcessingCapacity] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [collectionSchedule, setCollectionSchedule] = useState('');
  const [wasteStandards, setWasteStandards] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isLogin) {
        if (!role) {
          throw new Error('Please select a role');
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (role === 'user' && (!organizationName || !businessType || !wasteVolume)) {
          throw new Error('Please fill in all required business details');
        }

        if (role === 'provider' && (!facilityName || !processingCapacity || !serviceArea)) {
          throw new Error('Please fill in all required facility details');
        }

        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role,
            ...(role === 'user' ? {
              companyName: organizationName,
              businessType,
              wasteVolume: `${wasteVolume} ${volumeUnit}`,
              collectionFrequency: collectionFrequency === 'custom' ? customFrequency : collectionFrequency,
              address,
              city,
              state,
              zip,
              phone,
              operatingHours,
            } : {
              companyName: facilityName,
              processingCapacity,
              serviceArea,
              collectionSchedule,
              wasteStandards,
              address,
              city,
              state,
              zip,
              phone,
            }),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to sign up');
        }

        // Store user data in localStorage
        localStorage.setItem('userRole', role);
        localStorage.setItem('tempEmail', email);
        if (role === 'user') {
          localStorage.setItem('companyName', organizationName);
          localStorage.setItem('serviceType', businessType);
        } else {
          localStorage.setItem('companyName', facilityName);
          localStorage.setItem('serviceType', 'Composting Facility');
        }
      } else {
        const response = await fetch('/api/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to sign in');
        }

        // Store user data from response
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('tempEmail', data.user.email);
        localStorage.setItem('companyName', data.user.companyName || '');
        localStorage.setItem('serviceType', data.user.serviceType || '');
      }

      updateUserData();
      onLogin();
      navigate('/about');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
        <div className="flex justify-center mb-8">
          <Leaf className="h-12 w-12 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {isLogin ? 'Welcome Back' : 'Join Our Waste Management Platform'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === 'user'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                    disabled={isLoading}
                  >
                    <Building2 className={`h-8 w-8 mb-2 ${role === 'user' ? 'text-green-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${role === 'user' ? 'text-green-600' : 'text-gray-600'}`}>
                      HORECA Business
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('provider')}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                      role === 'provider'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                    disabled={isLoading}
                  >
                    <Truck className={`h-8 w-8 mb-2 ${role === 'provider' ? 'text-green-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${role === 'provider' ? 'text-green-600' : 'text-gray-600'}`}>
                      Composting Facility
                    </span>
                  </button>
                </div>
              </div>

              {role === 'user' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      placeholder="Enter your organization name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      disabled={isLoading}
                    >
                      <option value="hotel">Hotel</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="cafe">Cafe</option>
                      <option value="school">School</option>
                      <option value="company">Company</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Daily Organic Waste Volume
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={wasteVolume}
                          onChange={(e) => setWasteVolume(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                          min="0"
                          step="0.1"
                          placeholder="Amount"
                          disabled={isLoading}
                        />
                        <select
                          value={volumeUnit}
                          onChange={(e) => setVolumeUnit(e.target.value as 'kg' | 'tons')}
                          className="w-24 px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          disabled={isLoading}
                        >
                          <option value="kg">kg</option>
                          <option value="tons">tons</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collection Frequency
                      </label>
                      <select
                        value={collectionFrequency}
                        onChange={(e) => setCollectionFrequency(e.target.value as CollectionFrequency)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        disabled={isLoading}
                      >
                        <option value="daily">Daily</option>
                        <option value="alternate">Alternate Days</option>
                        <option value="weekly">Weekly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  {collectionFrequency === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specify Custom Frequency
                      </label>
                      <input
                        type="text"
                        value={customFrequency}
                        onChange={(e) => setCustomFrequency(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="e.g., Twice per week"
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      placeholder="e.g., Mon-Fri 9AM-5PM"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {role === 'provider' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facility Name
                    </label>
                    <input
                      type="text"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      placeholder="Enter facility name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Processing Capacity (tons/day)
                    </label>
                    <input
                      type="number"
                      value={processingCapacity}
                      onChange={(e) => setProcessingCapacity(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      min="0"
                      step="0.1"
                      placeholder="Enter processing capacity"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Area Coverage
                    </label>
                    <input
                      type="text"
                      value={serviceArea}
                      onChange={(e) => setServiceArea(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      placeholder="e.g., San Francisco Bay Area"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection Schedule Availability
                    </label>
                    <input
                      type="text"
                      value={collectionSchedule}
                      onChange={(e) => setCollectionSchedule(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      placeholder="e.g., 24/7, Mon-Sat 6AM-6PM"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waste Segregation Standards
                    </label>
                    <textarea
                      value={wasteStandards}
                      onChange={(e) => setWasteStandards(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      required
                      placeholder="Describe your waste segregation requirements"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {(role === 'user' || role === 'provider') && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="Enter street address"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="Enter city"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="Enter state"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="Enter ZIP code"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      placeholder="Enter phone number"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          
          <button
            type="submit"
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              if (!isLoading) {
                setIsLogin(!isLogin);
                setError('');
                setRole(null);
                setOrganizationName('');
                setFacilityName('');
                setConfirmPassword('');
              }
            }}
            className="text-green-600 hover:text-green-500 font-medium"
            disabled={isLoading}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}