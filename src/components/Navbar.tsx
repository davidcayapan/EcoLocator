import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Recycle, Sprout, TreePine, LogOut, MapPin, User, Building2, Factory } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const { userRole, userName, companyName, facilityName, email } = useUser();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('offlineAccess');
    localStorage.removeItem('tempEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('companyName');
    localStorage.removeItem('facilityName');
    onLogout();
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (userRole === 'horeca' && companyName) {
      return companyName;
    }
    if (userRole === 'facility' && facilityName) {
      return facilityName;
    }
    return 'Guest';
  };

  const getUserTypeLabel = () => {
    if (userRole === 'horeca') {
      return 'HoReCa Business';
    }
    if (userRole === 'facility') {
      return 'Composting Facility';
    }
    return 'Guest';
  };

  const getUserIcon = () => {
    if (userRole === 'horeca') {
      return <Building2 className="h-5 w-5" />;
    }
    if (userRole === 'facility') {
      return <Factory className="h-5 w-5" />;
    }
    return <User className="h-5 w-5" />;
  };

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-bold">EcoLocator</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/compost" className="flex items-center space-x-1 hover:text-green-200">
              <Recycle className="h-5 w-5" />
              <span>Waste Management</span>
            </Link>
            
            <Link to="/produce" className="flex items-center space-x-1 hover:text-green-200">
              <Sprout className="h-5 w-5" />
              <span>Local Produce</span>
            </Link>
            
            <Link to="/electronics" className="flex items-center space-x-1 hover:text-green-200">
              <TreePine className="h-5 w-5" />
              <span>About Us</span>
            </Link>
            
            <Link to="/sustainability" className="flex items-center space-x-1 hover:text-green-200">
              <Leaf className="h-5 w-5" />
              <span>Eco Guide</span>
            </Link>

            <Link to="/map" className="flex items-center space-x-1 hover:text-green-200">
              <MapPin className="h-5 w-5" />
              <span>Find Services</span>
            </Link>

            <div className="border-l border-green-500 pl-6 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getUserIcon()}
                <div className="text-sm">
                  <p className="font-medium">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-green-200 text-xs">
                    {getUserTypeLabel()}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-1 hover:text-green-200 bg-green-700 px-3 py-1 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}