import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import StationsList from '../components/StationsList';
import AIChatbot from '../components/AI/AIChatbot';
import mockStations from '../mockData';
import { HiLightningBolt, HiClock, HiLocationMarker, HiDeviceMobile, HiShieldCheck, HiStar } from 'react-icons/hi';

const Home = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query) => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      setStations(mockStations);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <HeroSection onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasSearched && (
          <StationsList 
            stations={stations} 
            isLoading={isLoading} 
          />
        )}

        {!hasSearched && (
          <>
            {/* About Section */}
            <section id="about" className="py-16">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-emerald-800 mb-4">About EVConnects</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8"></div>
                <p className="max-w-3xl mx-auto text-gray-600 text-lg">
                  EVConnects is India's premier platform for finding and booking electric vehicle charging stations.
                  We connect EV drivers with charging infrastructure across the country, making electric mobility more accessible than ever.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                    alt="Electric vehicle charging" 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">Our Mission</h3>
                  <p className="text-gray-600 mb-6">
                    At EVConnects, we're committed to accelerating the transition to sustainable transportation in India by making EV charging simple, accessible, and reliable. 
                    We believe that by eliminating range anxiety and providing seamless charging experiences, we can help more people embrace electric mobility.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-emerald-500">
                        <HiLightningBolt className="h-6 w-6" />
                      </span>
                      <span className="ml-3 text-gray-600">
                        Providing real-time information on charging station availability
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-emerald-500">
                        <HiLocationMarker className="h-6 w-6" />
                      </span>
                      <span className="ml-3 text-gray-600">
                        Expanding India's EV charging network across urban and rural areas
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-emerald-500">
                        <HiShieldCheck className="h-6 w-6" />
                      </span>
                      <span className="ml-3 text-gray-600">
                        Ensuring reliable and secure transactions for all charging sessions
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Why Use EVConnects Section */}
            <section id="why-choose-us" className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-emerald-800 mb-4">Why Choose EVConnects?</h2>
                  <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8"></div>
                  <p className="max-w-3xl mx-auto text-gray-600 text-lg">
                    Our platform offers unique advantages that make electric vehicle charging easier and more convenient than ever before.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-emerald-500 mb-4">
                      <HiLocationMarker className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-3">Extensive Coverage</h3>
                    <p className="text-gray-600">
                      Access India's largest network of EV charging stations, including both urban centers and highway corridors.
                    </p>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-emerald-500 mb-4">
                      <HiClock className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-3">Real-Time Availability</h3>
                    <p className="text-gray-600">
                      Check charging station status and availability in real-time, eliminating unnecessary waiting.
                    </p>
                  </div>
                  
                  {/* Card 3 */}
                  <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-emerald-500 mb-4">
                      <HiDeviceMobile className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-3">Easy Booking</h3>
                    <p className="text-gray-600">
                      Book charging slots in advance and pay seamlessly through our secure platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-emerald-800 mb-4">What Our Users Say</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className="h-5 w-5" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "EVConnects has transformed my experience as an EV owner. I can easily find charging stations wherever I go, and the booking feature saves me so much time."
                  </p>
                  <div className="flex items-center">
                    <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-emerald-700">RK</div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Rahul Kumar</h4>
                      <p className="text-sm text-gray-500">Tata Nexon EV Owner</p>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className="h-5 w-5" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "As someone who travels frequently between cities, EVConnects has eliminated my range anxiety. The app is intuitive, and finding chargers on highways is now a breeze."
                  </p>
                  <div className="flex items-center">
                    <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-emerald-700">SM</div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Shalini Mehta</h4>
                      <p className="text-sm text-gray-500">MG ZS EV Owner</p>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      {[...Array(4)].map((_, i) => (
                        <HiStar key={i} className="h-5 w-5" />
                      ))}
                      <HiStar className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "The real-time updates on charging station availability have saved me countless hours. EVConnects makes owning an electric scooter in the city completely hassle-free."
                  </p>
                  <div className="flex items-center">
                    <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-emerald-700">VP</div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Vikram Patel</h4>
                      <p className="text-sm text-gray-500">Ather 450X Owner</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-emerald-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Simplify Your EV Charging?</h2>
                <p className="text-emerald-100 mb-8 text-lg">
                  Join thousands of EV owners across India who rely on EVConnects for hassle-free charging experiences.
                </p>
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 focus:ring-white">
                  Find Charging Stations
                </button>
              </div>
            </section>
          </>
        )}
      </div>
      
      {/* AI Chatbot - Always available */}
      <AIChatbot />
    </>
  );
};

export default Home;