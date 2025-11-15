import React, { useState } from 'react';
import { HiAdjustments, HiClock, HiLightningBolt, HiCalendar, HiTruck, HiClipboardCheck, HiChevronRight, HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    {
      id: 1,
      title: "EV Parts & Accessories",
      description: "High-quality replacement parts and accessories for all major EV brands in India.",
      shortDesc: "Quality parts for all EV brands",
      icon: <HiTruck className="h-10 w-10" />,
      color: "emerald",
      features: [
        "Original Equipment Manufacturer (OEM) parts",
        "Compatible with 50+ EV models",
        "24/7 delivery across India",
        "1-year warranty on all parts",
        "Expert installation support"
      ],
      details: "We stock everything from charging cables to battery components, motor parts, and interior accessories. Our parts are sourced directly from manufacturers and authorized dealers to ensure authenticity and quality."
    },
    {
      id: 2,
      title: "EV Vehicle Service",
      description: "Professional maintenance and repair services by certified EV technicians.",
      shortDesc: "Professional EV maintenance",
      icon: <HiAdjustments className="h-10 w-10" />,
      color: "blue",
      features: [
        "Certified EV technicians",
        "Software updates & diagnostics",
        "Battery health monitoring",
        "Motor performance tuning",
        "Comprehensive safety checks"
      ],
      details: "Our experts handle everything from software updates to battery diagnostics, motor repairs, and complete system overhauls. We use advanced diagnostic tools to ensure your EV performs at its best."
    },
    {
      id: 3,
      title: "Routine Checkups",
      description: "Preventive maintenance plans to keep your EV in optimal condition.",
      shortDesc: "Keep your EV running smoothly",
      icon: <HiClipboardCheck className="h-10 w-10" />,
      color: "indigo",
      features: [
        "Monthly & quarterly plans",
        "Battery degradation analysis",
        "Tire pressure monitoring",
        "Brake system inspection",
        "Coolant & fluid checks"
      ],
      details: "Regular inspections that extend battery life, improve performance, and prevent costly repairs. Our preventive maintenance keeps your EV running efficiently for years."
    },
    {
      id: 4,
      title: "Priority Charging Slots",
      description: "Book your charging slots in advance to avoid waiting times.",
      shortDesc: "Skip the queue, charge faster",
      icon: <HiCalendar className="h-10 w-10" />,
      color: "purple",
      features: [
        "Reserve slots up to 7 days ahead",
        "Premium charging stations",
        "Guaranteed availability",
        "Flexible cancellation",
        "Mobile notifications"
      ],
      details: "Reserve premium charging stations during peak hours. Perfect for business travelers and daily commuters who need reliable charging schedules."
    },
    {
      id: 5,
      title: "Fast Charging",
      description: "Access to our network of high-speed charging stations.",
      shortDesc: "Charge up to 80% in 30 minutes",
      icon: <HiLightningBolt className="h-10 w-10" />,
      color: "yellow",
      features: [
        "DC fast charging up to 150kW",
        "Compatible with all EV types",
        "Real-time charging status",
        "Payment integration",
        "Multiple connector types"
      ],
      details: "Our high-speed charging network can charge your EV up to 80% in just 30 minutes. Located strategically across highways and city centers for maximum convenience."
    },
    {
      id: 6,
      title: "Roadside Assistance",
      description: "24/7 emergency roadside assistance for EV owners.",
      shortDesc: "24/7 emergency support",
      icon: <HiClock className="h-10 w-10" />,
      color: "red",
      features: [
        "24/7 availability",
        "Emergency charging service",
        "Towing to nearest station",
        "Technical troubleshooting",
        "Mobile repair units"
      ],
      details: "Our specialized team handles everything from battery depletion to technical malfunctions. Mobile charging units and expert technicians are available round the clock."
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'border-emerald-500 bg-emerald-50 text-emerald-600',
      blue: 'border-blue-500 bg-blue-50 text-blue-600',
      indigo: 'border-indigo-500 bg-indigo-50 text-indigo-600',
      purple: 'border-purple-500 bg-purple-50 text-purple-600',
      yellow: 'border-yellow-500 bg-yellow-50 text-yellow-600',
      red: 'border-red-500 bg-red-50 text-red-600'
    };
    return colors[color] || colors.emerald;
  };

  const openServiceModal = (service) => {
    setSelectedService(service);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  return (
  <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero section */}
      <div className="relative py-20 bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-white/90 mb-8"
          >
            Comprehensive solutions for all your electric vehicle needs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 text-white/80"
          >
            <div className="flex items-center space-x-2">
              <HiClipboardCheck className="h-5 w-5" />
              <span>Expert Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiLightningBolt className="h-5 w-5" />
              <span>Fast Solutions</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiPhone className="h-5 w-5" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Services grid */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">What We Offer</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Choose from our comprehensive range of EV services designed to keep you moving</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group cursor-pointer"
              onClick={() => openServiceModal(service)}
            >
              <div className="p-8 relative">
                <div className={`inline-flex p-4 rounded-2xl mb-6 ${getColorClasses(service.color)}`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-emerald-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{service.shortDesc}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-600">Learn More</span>
                  <motion.div
                    animate={{ x: hoveredCard === service.id ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiChevronRight className="h-5 w-5 text-emerald-600" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-emerald-700 via-blue-700 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need a Custom Service?
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-white/90 mb-8">
              We offer tailored solutions for fleet operators, businesses, and individual EV owners with specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center px-8 py-4 border border-transparent rounded-full shadow-lg text-lg font-medium text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 focus:ring-white transition-all">
                <HiPhone className="h-5 w-5 mr-2" />
                Call Us: +91-8000-123-456
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-emerald-700 transition-all">
                <HiMail className="h-5 w-5 mr-2" />
                Email Support
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeServiceModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(selectedService.color)}`}>
                    {selectedService.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedService.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedService.shortDesc}</p>
                  </div>
                </div>
                <button
                  onClick={closeServiceModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">About This Service</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedService.details}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">What's Included</h4>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                  Book This Service
                </button>
                <button className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                  Get Quote
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <HiLocationMarker className="h-4 w-4" />
                  <span>Available in 50+ cities across India</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Services;