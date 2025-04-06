import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Users, Send, Smile, Frown, Meh, User, Building2, Factory } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface FeedbackCategory {
  id: string;
  title: string;
  description: string;
}

const feedbackCategories: FeedbackCategory[] = [
  {
    id: 'usability',
    title: 'Platform Usability',
    description: 'How easy is it to navigate and use our platform?'
  },
  {
    id: 'features',
    title: 'Features & Functionality',
    description: 'How satisfied are you with our platform features?'
  },
  {
    id: 'content',
    title: 'Content Quality',
    description: 'How helpful and accurate is our sustainability information?'
  },
  {
    id: 'impact',
    title: 'Environmental Impact',
    description: 'How effectively does our platform help you be more sustainable?'
  }
];

export default function Sustainability() {
  const { email, userName, companyName, facilityName, userRole } = useUser();
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStars, setHoveredStars] = useState<{ [key: string]: number }>({});

  const handleRating = (category: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleStarHover = (category: string, rating: number) => {
    setHoveredStars(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleStarLeave = (category: string) => {
    setHoveredStars(prev => ({
      ...prev,
      [category]: 0
    }));
  };

  const getAverageRating = () => {
    const values = Object.values(ratings);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  const getSentiment = (rating: number) => {
    if (rating >= 4) return <Smile className="h-6 w-6 text-green-500" />;
    if (rating >= 2.5) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Frown className="h-6 w-6 text-red-500" />;
  };

  const getUserIcon = () => {
    if (!userRole || userRole === 'guest') return <User className="h-5 w-5" />;
    if (userRole === 'horeca') return <Building2 className="h-5 w-5" />;
    return <Factory className="h-5 w-5" />;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the ratings and feedback to your backend
    const feedbackData = {
      email,
      userRole,
      ratings,
      feedback,
      submittedAt: new Date().toISOString(),
      userName: getUserDisplayName()
    };
    console.log('Feedback Data:', feedbackData);
    setSubmitted(true);
  };

  const renderStars = (category: string) => {
    const currentRating = ratings[category] || 0;
    const hoverRating = hoveredStars[category] || 0;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRating(category, star)}
            onMouseEnter={() => handleStarHover(category, star)}
            onMouseLeave={() => handleStarLeave(category)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hoverRating || currentRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!email) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to provide feedback about our platform.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <ThumbsUp className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You for Your Feedback!</h2>
          <p className="text-gray-600 mb-6">
            Your input helps us improve our platform and better serve our community.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another Rating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Rate Your Experience</h1>
          <p className="text-lg text-gray-600">
            Help us improve our platform by sharing your feedback
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
            {getUserIcon()}
            <span>Submitting as {getUserDisplayName()} • {getUserTypeLabel()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid gap-8">
              {feedbackCategories.map((category) => (
                <div key={category.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                    {renderStars(category.id)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts and suggestions..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
            />
          </div>

          <div className="bg-green-50 rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-full">
                {getSentiment(getAverageRating())}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Overall Rating</h3>
                <p className="text-gray-600">
                  {getAverageRating().toFixed(1)} out of 5 stars
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.keys(ratings).length === 0}
            >
              <Send className="h-4 w-4" />
              Submit Feedback
            </button>
          </div>
        </form>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Your feedback helps us create a better experience for everyone.</p>
          <p>Thank you for being part of our sustainability journey!</p>
        </div>
      </div>
    </div>
  );
}