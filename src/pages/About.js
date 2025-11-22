import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AboutSEO } from '../components/SEO';
import { 
  HiLightningBolt, 
  HiGlobeAlt, 
  HiShieldCheck, 
  HiStar,
  HiUserGroup,
  HiLocationMarker,
  HiClock,
  HiHeart
} from 'react-icons/hi';

const About = () => {
  const stats = [
    { label: 'Charging Points Connected', value: '1,200+', icon: HiLightningBolt },
    { label: 'Early Adopters', value: '3,500+', icon: HiUserGroup },
    { label: 'Cities Launched', value: '8', icon: HiLocationMarker },
    { label: 'Months in Business', value: '3', icon: HiClock }
  ];

  const teamMembers = [
    {
      name: 'Rohit Sharma',
      position: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      description: 'Visionary entrepreneur leading EVConnects mission to revolutionize India\'s EV charging infrastructure. Passionate about sustainable technology and electric mobility solutions.'
    },
    {
      name: 'Kumar Utkarsh',
      position: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      description: 'Tech innovator and architect behind EVConnects AI-powered platform. Expert in IoT, machine learning, and smart charging infrastructure development.'
    },
    {
      name: 'Lakshit Kumar',
      position: 'Head of Product & Strategy',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      description: 'Product strategist driving user experience innovation and market expansion. Focused on making EV charging seamless and accessible for all Indians.'
    },
    {
      name: 'Team EVConnects',
      position: 'Growing Team',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      description: 'Our passionate team of engineers, designers, and sustainability experts working together to build India\'s most advanced EV charging network.'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We continuously innovate to make EV charging smarter, faster, and more accessible.',
      icon: HiLightningBolt,
      color: 'emerald'
    },
    {
      title: 'Sustainability',
      description: 'Our mission is to accelerate the world\'s transition to sustainable transportation.',
      icon: HiGlobeAlt,
      color: 'blue'
    },
    {
      title: 'Reliability',
      description: 'We provide dependable charging solutions you can trust, wherever you go.',
      icon: HiShieldCheck,
      color: 'indigo'
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service and customer experience.',
      icon: HiStar,
      color: 'purple'
    }
  ];

  const milestones = [
    {
      year: 'Aug 2025',
      title: 'EVConnects Founded',
      description: 'Started by Rohit Sharma, Kumar Utkarsh, and Lakshit Kumar with a vision to revolutionize EV charging in India'
    },
    {
      year: 'Sep 2025',
      title: 'Platform Development',
      description: 'Built our AI-powered platform and connected first 200 charging stations across 3 cities'
    },
    {
      year: 'Oct 2025',
      title: 'Mobile App Launch',
      description: 'Launched our comprehensive mobile app with real-time station finder and booking system'
    },
    {
      year: 'Nov 2025',
      title: 'Rapid Expansion',
      description: 'Scaled to 1200+ charging points across 8 cities, onboarded 3500+ users in just 3 months'
    },
    {
      year: 'Q1 2026',
      title: 'Target: 5000+ Stations',
      description: 'Aiming to reach 5000+ charging stations across 25+ cities by March 2026'
    },
    {
      year: 'Q2 2026',
      title: 'National Network',
      description: 'Target to establish presence in 50+ cities with 10,000+ charging points nationwide'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20',
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      indigo: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20',
      purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <AboutSEO />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-700 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            About EVConnects
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-white/90 mb-8"
          >
            Founded just 3 months ago in August 2025, we're rapidly pioneering India's electric vehicle revolution with intelligent charging solutions and aggressive growth targets
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-emerald-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
            >
              Explore Our Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in August 2025, our mission is to accelerate India's transition to sustainable transportation 
                by building the most comprehensive, reliable, and intelligent electric vehicle charging network in the country. 
                In just 3 months, we've established a strong foundation and ambitious growth trajectory.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We believe that electric mobility should be accessible, convenient, and worry-free for every Indian. 
                Through our AI-powered platform and rapidly expanding charging infrastructure, we're eliminating range anxiety 
                and making electric vehicles the preferred choice for millions across the nation.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1558618644-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Electric car charging"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              The principles that guide everything we do at EVConnects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${getColorClasses(value.color)}`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Key milestones in our mission to electrify India's transportation
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-emerald-200 dark:bg-emerald-800 hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
                  
                  {/* Spacer for opposite side */}
                  <div className="hidden lg:block lg:w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              The passionate individuals driving India's EV revolution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-700 via-blue-700 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join the EV Revolution?
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-white/90 mb-8">
              Be part of India's sustainable future. Start your electric journey with EVConnects today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-emerald-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
              >
                <HiHeart className="mr-2 h-5 w-5" />
                Join EVConnects
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-emerald-700 transition-all"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;