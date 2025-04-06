import React from 'react';
import { Users, Leaf, Globe, Award, Target, Heart } from 'lucide-react';

export default function AboutUs() {
  const stats = [
    { label: 'Active Users', value: '3' },
    { label: 'Waste Diverted', value: 'TBD' },
    { label: 'Partner Facilities', value: 'TBD' },
    { label: 'Cities Served', value: 'TBD' },
  ];

  const team = [
    {
      name: 'David Cayapan',
      role: 'SF Hacker',
      image: 'https://media.discordapp.net/attachments/1357967982214643862/1358337720501403668/20250406_000819.jpg?ex=67f37a15&is=67f22895&hm=3b35b8b1d19e2782033a703e1a151f4767d297b21feb01b519a9c89c64ac8f40&=&format=webp&width=810&height=1080',
      bio: 'A first-year student studying Computer Science and Statistics from UC Davis.'
    },
    {
      name: 'Kyail Nay La',
      role: 'SF Hacker',
      image: 'https://media.discordapp.net/attachments/1357967982214643862/1358338698822811660/image0.jpg?ex=67f37afe&is=67f2297e&hm=d700288c18a0c56a8b4cfc4a09ad41abb72edfacbfd9350543cfe2f51bbf7669&=&format=webp&width=810&height=1080',
      bio: 'A first-year student studying Computer Science and Electrical Engineering from Skyline College.'
    },
    {
      name: 'Akshay ',
      role: 'SF Hacker',
      image: 'https://media.discordapp.net/attachments/1357967982214643862/1358339100213510247/IMG_3796.jpg?ex=67f37b5e&is=67f229de&hm=9008aa4ecd198e2a91b8271a7cc51c6b34567e53faa1f87b72ab2dfc88ffc429&=&format=webp&width=810&height=1080',
      bio: 'Masters student at CSU, Chico from India.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Making Sustainability Accessible
            </h1>
            <p className="text-xl text-green-100">
              We're on a mission to revolutionize waste management and create a more sustainable future for our planet.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50"></div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Mission</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-gray-50">
                <div className="flex justify-center mb-4">
                  <Globe className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
                <p className="text-gray-600">
                  Reducing landfill waste through innovative composting solutions.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gray-50">
                <div className="flex justify-center mb-4">
                  <Target className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Circular Economy</h3>
                <p className="text-gray-600">
                  Creating sustainable cycles for organic waste management.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gray-50">
                <div className="flex justify-center mb-4">
                  <Heart className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
                <p className="text-gray-600">
                  Building partnerships for a greener, cleaner future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Watch Our Story</h2>
            <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/im-7LqvB6sY?si=pAz4QuKS3GLX7Vgt"
                title="EcoLocator Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center text-gray-600 mt-6">
              Learn more about our journey and vision for a sustainable future.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">About Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-green-600 mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sustainability First</h3>
                <p className="text-gray-600">
                  Every decision we make is guided by its environmental impact and long-term sustainability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                <p className="text-gray-600">
                  We believe in the power of community collaboration to drive meaningful change.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service and operations.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
                <p className="text-gray-600">
                  While we act locally, our vision is to create global environmental impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}