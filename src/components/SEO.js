import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'EVConnects - Find & Book EV Charging Stations Near You',
  description = 'Discover, book, and manage EV charging sessions with EVConnects. Find the nearest charging stations, get real-time availability, smart route optimization, and AI-powered insights for your electric vehicle.',
  keywords = 'EV charging, electric vehicle, charging stations, EV charger finder, electric car charging, Tesla charging, fast charging, DC charging, AC charging, EV network, sustainable transport, green energy, carbon footprint, battery health, route optimization',
  image = '/og-image.jpg',
  url = 'https://evconnects.com',
  type = 'website',
  author = 'EVConnects Team',
  published = null,
  modified = null,
  canonical = null,
  noindex = false,
  nofollow = false,
  structuredData = null
}) => {
  const siteTitle = 'EVConnects';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  const canonicalUrl = canonical || url;
  
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": fullTitle,
    "description": description,
    "url": canonicalUrl,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteTitle,
      "logo": {
        "@type": "ImageObject",
        "url": `${url}/logo192.png`
      }
    },
    "datePublished": published,
    "dateModified": modified || published
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${url}${image}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${url}${image}`} />
      <meta name="twitter:creator" content="@evconnects" />
      <meta name="twitter:site" content="@evconnects" />

      {/* Article specific meta tags */}
      {published && <meta property="article:published_time" content={published} />}
      {modified && <meta property="article:modified_time" content={modified} />}
      {author && <meta property="article:author" content={author} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

// Pre-configured SEO components for specific pages
export const HomeSEO = () => (
  <SEO
    title="EVConnects - Smart EV Charging Network Platform"
    description="Join the future of electric vehicle charging with EVConnects. Find charging stations, optimize routes, track battery health, and reduce your carbon footprint with our AI-powered platform."
    keywords="EV charging network, electric vehicle platform, smart charging, AI-powered EV assistant, sustainable transportation, green mobility"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "EVConnects",
      "url": "https://evconnects.com",
      "description": "Smart EV charging network platform with AI-powered insights",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://evconnects.com/stations?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }}
  />
);

export const StationSearchSEO = () => (
  <SEO
    title="Find EV Charging Stations Near You"
    description="Search and filter thousands of EV charging stations. Get real-time availability, pricing, and connector types. Book your charging session instantly."
    keywords="find EV chargers, charging station locator, EV charging map, Tesla supercharger, fast charging stations, DC charging, Level 2 charging"
    url="https://evconnects.com/stations"
  />
);

export const AboutSEO = () => (
  <SEO
    title="About EVConnects - Leading EV Charging Platform"
    description="Learn about EVConnects mission to accelerate sustainable transportation through intelligent EV charging solutions. Discover our story, team, and commitment to clean energy."
    keywords="about EVConnects, EV charging company, sustainable transportation, clean energy, electric vehicle platform"
    url="https://evconnects.com/about"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About EVConnects",
      "description": "Leading EV charging platform accelerating sustainable transportation",
      "url": "https://evconnects.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "EVConnects",
        "description": "Smart EV charging network platform",
        "foundingDate": "2024",
        "mission": "Accelerating sustainable transportation through intelligent EV charging solutions"
      }
    }}
  />
);

export const ContactSEO = () => (
  <SEO
    title="Contact EVConnects - Get Support & Partnership Info"
    description="Get in touch with EVConnects for customer support, partnership opportunities, or general inquiries. We're here to help with your EV charging needs."
    keywords="contact EVConnects, EV charging support, customer service, partnership opportunities, help desk"
    url="https://evconnects.com/contact"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact EVConnects",
      "description": "Get support and partnership information",
      "url": "https://evconnects.com/contact"
    }}
  />
);

export const ProfileSEO = () => (
  <SEO
    title="Your EV Profile & Settings"
    description="Manage your electric vehicle profile, charging preferences, and account settings. Track your charging history and optimize your EV experience."
    keywords="EV profile, user settings, charging history, vehicle management, account dashboard"
    url="https://evconnects.com/profile"
    noindex={true} // Private user content
  />
);

export const BookingHistorySEO = () => (
  <SEO
    title="Your Charging Session History"
    description="View and manage your EV charging session history. Download receipts, track energy consumption, and analyze your charging patterns."
    keywords="charging history, EV sessions, charging receipts, energy tracking, charging analytics"
    url="https://evconnects.com/bookings"
    noindex={true} // Private user content
  />
);

export const AdminSEO = () => (
  <SEO
    title="Admin Panel - EVConnects Management"
    description="Administrative dashboard for managing EVConnects platform, users, stations, and analytics."
    url="https://evconnects.com/admin"
    noindex={true} // Private admin content
    nofollow={true}
  />
);

export const LoginSEO = () => (
  <SEO
    title="Login to EVConnects - Access Your EV Charging Account"
    description="Sign in to your EVConnects account to find charging stations, book sessions, and manage your electric vehicle charging experience."
    keywords="EVConnects login, sign in, user account, EV charging access"
    url="https://evconnects.com/login"
  />
);

export const SignupSEO = () => (
  <SEO
    title="Join EVConnects - Create Your EV Charging Account"
    description="Sign up for EVConnects and join thousands of EV owners finding, booking, and managing charging sessions. Get started with your free account today."
    keywords="EVConnects signup, create account, join EV network, register electric vehicle, free EV account"
    url="https://evconnects.com/signup"
  />
);

export default SEO;