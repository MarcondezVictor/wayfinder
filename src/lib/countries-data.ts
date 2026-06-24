export interface PointOfInterest {
  name: string;
  description: string;
  imageUrl: string;
}

export interface CountrySchema {
  id: string;
  name: string;
  slug: string;
  isoCode: string;
  capital: string;
  continent: string;
  population: number;
  languages: string;
  currency: string;

  // Travel & Legal Requirements
  visaRequirements: string;
  passportRequirements: string;
  etiasRequirements: string;
  vaccineRequirements: string;

  // Safety Metrics
  safetyScore: number; // 1-10
  emergencyNumbers: string;
  travelWarnings: string | null;

  // Economy & Budgets (in EUR)
  avgHotelPrice: number;
  avgMealPrice: number;
  avgTransportCost: number;
  costLivingIndex: number; // 1-120

  // Climate Details
  climateType: string;
  climateDetails: string;

  // Tourism & Cities
  topAttractions: PointOfInterest[];
  majorCities: string[];
  bestTimeVisit: string;

  // Practical Metrics (1-10)
  powerPlugType: string;
  internetQualityScore: number;
  transportQualityScore: number;
  healthcareQualityScore: number;

  // Aesthetics
  imageUrl: string;
  flagEmoji: string;
  tagline: string;
  description: string;
}

export const countriesData: CountrySchema[] = [
  {
    id: "1",
    name: "Portugal",
    slug: "portugal",
    isoCode: "PT",
    capital: "Lisbon",
    continent: "Europa",
    population: 10300000,
    languages: "Portuguese",
    currency: "Euro (EUR)",
    visaRequirements: "Not applicable — Portugal is the destination. Portuguese citizens live and travel freely within the country.",
    passportRequirements: "Not applicable.",
    etiasRequirements: "Not applicable — EU citizens are exempt from ETIAS.",
    vaccineRequirements: "No mandatory vaccinations for residents of Portugal.",
    safetyScore: 9,
    emergencyNumbers: "112 (National Emergency)",
    travelWarnings: null,
    avgHotelPrice: 75,
    avgMealPrice: 15,
    avgTransportCost: 2.5,
    costLivingIndex: 55,
    climateType: "Mediterranean",
    climateDetails: "Mild winters with some rainfall and long, dry, hot summers. The Algarve enjoys over 300 sunny days per year.",
    topAttractions: [
      {
        name: "Tower of Belém (Lisbon)",
        description: "A Manueline Gothic monument that served as a fortress and departure point for Portugal's Age of Discovery voyages.",
        imageUrl: "/attractions/pt-1.jpg",
      },
      {
        name: "Pena Palace (Sintra)",
        description: "The finest example of Portuguese Romantic architecture, perched atop the hills of Sintra with vivid colours and fairy-tale turrets.",
        imageUrl: "/attractions/pt-2.jpg",
      },
      {
        name: "Luís I Bridge (Porto)",
        description: "A double-deck metal arch bridge spanning the Douro River, connecting Porto to Vila Nova de Gaia with sweeping views.",
        imageUrl: "/attractions/pt-3.jpg",
      }
    ],
    majorCities: ["Lisbon", "Porto", "Coimbra", "Braga", "Faro"],
    bestTimeVisit: "April to October (Spring and Autumn are ideal for sightseeing; Summer for beach)",
    powerPlugType: "Type C / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 8,
    healthcareQualityScore: 9,
    imageUrl: "/covers/pt.jpg",
    flagEmoji: "🇵🇹",
    tagline: "Land of explorers, golden beaches and vibrant history.",
    description: "Portugal combines a rich cultural and historical legacy with one of Europe's finest climates. Celebrated for fado music, warm hospitality, seafood cuisine and custard tarts (pastéis de nata), the country attracts an ever-growing stream of students, digital nomads and travellers from around the world."
  },
  {
    id: "2",
    name: "Brazil",
    slug: "brazil",
    isoCode: "BR",
    capital: "Brasília",
    continent: "América do Sul",
    population: 214300000,
    languages: "Portuguese",
    currency: "Real (BRL)",
    visaRequirements: "Portuguese citizens (EU) can enter Brazil visa-free for tourism stays of up to 90 days, extendable by a further 90 days (maximum 180 days per year).",
    passportRequirements: "Valid Portuguese passport for the duration of the stay. A minimum validity of 6 months beyond the return date is recommended.",
    etiasRequirements: "Not applicable — Brazil does not require ETIAS. Direct entry with a passport.",
    vaccineRequirements: "Yellow fever vaccination is mandatory when visiting the Amazon, Pantanal or central-western states. Typhoid fever and hepatitis A vaccines are also recommended.",
    safetyScore: 5,
    emergencyNumbers: "190 (Military Police), 192 (SAMU), 193 (Fire Brigade)",
    travelWarnings: "Exercise increased caution in major cities. Avoid walking alone at night in deserted areas or favelas without authorised guides.",
    avgHotelPrice: 45,
    avgMealPrice: 8,
    avgTransportCost: 1.2,
    costLivingIndex: 38,
    climateType: "Tropical / Equatorial",
    climateDetails: "Hot and humid for most of the year. The north and north-east are predominantly tropical, while the south has four distinct seasons with cool winters.",
    topAttractions: [
      {
        name: "Christ the Redeemer (Rio de Janeiro)",
        description: "An iconic Art Deco statue atop Corcovado Hill, offering sweeping views of the entire bay of Rio.",
        imageUrl: "/attractions/br-1.jpg",
      },
      {
        name: "Iguaçu Falls (Paraná)",
        description: "The world's largest waterfall system, surrounded by a biodiverse tropical rainforest shared between Brazil and Argentina.",
        imageUrl: "/attractions/br-2.jpg",
      },
      {
        name: "Pelourinho (Salvador)",
        description: "Salvador's historic centre, featuring richly coloured Portuguese colonial facades and vibrant Afro-Brazilian culture.",
        imageUrl: "/attractions/br-3.jpg",
      }
    ],
    majorCities: ["São Paulo", "Rio de Janeiro", "Salvador", "Belo Horizonte", "Curitiba"],
    bestTimeVisit: "December to March (Carnival and Summer) or June to September (milder weather in the south)",
    powerPlugType: "Type N (220V or 127V, 60Hz)",
    internetQualityScore: 7,
    transportQualityScore: 5,
    healthcareQualityScore: 6,
    imageUrl: "/covers/br.jpg",
    flagEmoji: "🇧🇷",
    tagline: "Rhythm, tropical beaches and the world's largest rainforest.",
    description: "Brazil is an explosion of energy, cultural diversity and unparalleled natural beauty. From the vast green expanses of the Amazon to the beaches of Rio de Janeiro, the country is famous for its music, passion for football, churrasco barbecue and one of the most vibrant communities on the planet."
  },
  {
    id: "3",
    name: "Ukraine",
    slug: "ukraine",
    isoCode: "UA",
    capital: "Kyiv",
    continent: "Europa",
    population: 38000000,
    languages: "Ukrainian",
    currency: "Hryvnia (UAH)",
    visaRequirements: "Not recommended — armed conflict is ongoing. Under normal circumstances, Portuguese citizens (EU) could enter visa-free for up to 90 days. Consult your foreign ministry before any travel.",
    passportRequirements: "Valid Portuguese passport. Under normal circumstances, a minimum validity of 3 months beyond the planned departure date is required.",
    etiasRequirements: "Not applicable — Ukraine is not part of the Schengen Area and does not require ETIAS.",
    vaccineRequirements: "No mandatory vaccinations. Keeping routine vaccines up to date (tetanus, hepatitis A) is recommended.",
    safetyScore: 3,
    emergencyNumbers: "101 (Fire), 102 (Police), 103 (Ambulance), 112 (General Emergency)",
    travelWarnings: "Active conflict alert in effect. All tourist travel to the territory is strongly discouraged at this time.",
    avgHotelPrice: 30,
    avgMealPrice: 6,
    avgTransportCost: 0.5,
    costLivingIndex: 32,
    climateType: "Moderate Continental",
    climateDetails: "Cold, snowy winters and warm summers. The southern coast along the Black Sea has historically had a milder, more temperate climate.",
    topAttractions: [
      {
        name: "Saint Sophia Cathedral (Kyiv)",
        description: "An exceptional medieval monument founded in the 11th century, renowned for its golden domes and original Byzantine mosaics.",
        imageUrl: "/attractions/ua-1.jpg",
      },
      {
        name: "Lviv Old Town",
        description: "A jewel of Eastern Europe featuring cobblestone streets, Renaissance architecture and a legendary café culture.",
        imageUrl: "/attractions/ua-2.jpg",
      },
      {
        name: "Carpathian Mountains",
        description: "Dense pine forests, crystal-clear rivers and the traditional Hutsul culture in the mountainous west of the country.",
        imageUrl: "/attractions/ua-3.jpg",
      }
    ],
    majorCities: ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"],
    bestTimeVisit: "May to September (pleasant temperatures and blooming parks)",
    powerPlugType: "Type C / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 7,
    healthcareQualityScore: 7,
    imageUrl: "/covers/ua.jpg",
    flagEmoji: "🇺🇦",
    tagline: "Courageous hearts, golden domes and endless wheat fields.",
    description: "Ukraine is a land of Eastern European contrasts — magnificent cathedrals with gleaming domes, a rich Cossack heritage, colourful folk festivals and a highly dynamic and resilient technology ecosystem."
  },
  {
    id: "4",
    name: "France",
    slug: "france",
    isoCode: "FR",
    capital: "Paris",
    continent: "Europa",
    population: 68000000,
    languages: "French",
    currency: "Euro (EUR)",
    visaRequirements: "Portuguese citizens enjoy full freedom of movement within the EU. Entry to France requires no visa — a national ID card or passport is sufficient, with no time limit.",
    passportRequirements: "A valid Portuguese national ID card is sufficient to enter and remain in France. Passport optional.",
    etiasRequirements: "Not applicable — EU citizens are exempt from ETIAS.",
    vaccineRequirements: "No mandatory vaccinations for Portuguese citizens travelling to France.",
    safetyScore: 8,
    emergencyNumbers: "112, 15 (Ambulance), 17 (Police), 18 (Fire Brigade)",
    travelWarnings: "Watch out for pickpockets and scams at major tourist spots in Paris. Political demonstrations occur frequently.",
    avgHotelPrice: 110,
    avgMealPrice: 20,
    avgTransportCost: 2.1,
    costLivingIndex: 78,
    climateType: "Temperate / Oceanic",
    climateDetails: "Cool winters and mild summers in the north. The south enjoys a pleasant Mediterranean climate with hot, dry summers and mild, sunny winters.",
    topAttractions: [
      {
        name: "Eiffel Tower (Paris)",
        description: "France's most iconic landmark — a monumental iron lattice structure built in 1889 on the banks of the Seine.",
        imageUrl: "/attractions/fr-1.jpg",
      },
      {
        name: "Palace of Versailles",
        description: "The former residence of French kings, renowned for its breathtaking Hall of Mirrors and perfectly manicured geometric gardens.",
        imageUrl: "/attractions/fr-2.jpg",
      },
      {
        name: "Mont Saint-Michel (Normandy)",
        description: "A fortified rocky island topped by a spectacular medieval Gothic abbey, surrounded by one of Europe's most extreme tidal ranges.",
        imageUrl: "/attractions/fr-3.jpg",
      }
    ],
    majorCities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    bestTimeVisit: "May to October (Spring to avoid crowds; Summer on the Côte d'Azur)",
    powerPlugType: "Type C / E (230V, 50Hz)",
    internetQualityScore: 9,
    transportQualityScore: 9,
    healthcareQualityScore: 10,
    imageUrl: "/covers/fr.jpg",
    flagEmoji: "🇫🇷",
    tagline: "The global capital of art, fine cuisine, fashion and romance.",
    description: "France has long been the world's most visited destination, thanks to its priceless artistic heritage, haute couture, refined gourmet cuisine and celebrated wine regions. From the metropolitan charm of Paris to the sun-drenched vineyards of the south, it delivers extraordinary experiences at every turn."
  },
  {
    id: "5",
    name: "Spain",
    slug: "spain",
    isoCode: "ES",
    capital: "Madrid",
    continent: "Europa",
    population: 47400000,
    languages: "Spanish (Castilian), Catalan, Galician, Basque",
    currency: "Euro (EUR)",
    visaRequirements: "Portuguese citizens enjoy full freedom of movement within the EU. Entry to Spain requires no visa — a national ID card or passport is sufficient, with no time limit.",
    passportRequirements: "A valid Portuguese national ID card is sufficient. Spain and Portugal share the Schengen Area — no border controls exist.",
    etiasRequirements: "Not applicable — EU citizens are exempt from ETIAS.",
    vaccineRequirements: "No mandatory vaccinations for Portuguese citizens travelling to Spain.",
    safetyScore: 8,
    emergencyNumbers: "112 (General Emergency), 091 (National Police)",
    travelWarnings: "Very safe overall. Be cautious of pickpockets on the metro, Las Ramblas in Barcelona and busy squares in Madrid.",
    avgHotelPrice: 85,
    avgMealPrice: 15,
    avgTransportCost: 1.8,
    costLivingIndex: 60,
    climateType: "Mediterranean / Semi-arid",
    climateDetails: "Hot, dry summers and mild winters with rainfall. The central plateau (Madrid) experiences extreme continental temperatures in both summer and winter.",
    topAttractions: [
      {
        name: "Sagrada Família (Barcelona)",
        description: "Antoni Gaudí's colossal basilica — the pinnacle of Catalan Modernisme and still under construction after over a century.",
        imageUrl: "/attractions/es-1.jpg",
      },
      {
        name: "Alhambra (Granada)",
        description: "A magnificent Moorish palace and fortress complex that stands as the crowning achievement of Islamic art in medieval Spain.",
        imageUrl: "/attractions/es-2.jpg",
      },
      {
        name: "Plaza de España (Seville)",
        description: "A stunning semi-circular palace and canal built in 1928, showcasing the splendour of Andalusian tilework and architecture.",
        imageUrl: "/attractions/es-3.jpg",
      }
    ],
    majorCities: ["Madrid", "Barcelona", "Seville", "Valencia", "Bilbao"],
    bestTimeVisit: "April to June and September to October (optimal temperatures without the sweltering summer heat)",
    powerPlugType: "Type C / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 8,
    healthcareQualityScore: 9,
    imageUrl: "/covers/es.jpg",
    flagEmoji: "🇪🇸",
    tagline: "Andalusian culture, medieval monuments and eternal sunshine.",
    description: "Spain combines sunshine, history and an irresistibly vibrant way of life. Famous for tapas nights, siestas, spectacular festivals, exquisite Moorish architecture and Mediterranean beaches, it is a compelling destination whether you're visiting for a weekend or settling in for the long term."
  },
  {
    id: "6",
    name: "United States",
    slug: "united-states",
    isoCode: "US",
    capital: "Washington D.C.",
    continent: "América do Norte",
    population: 331900000,
    languages: "English (Spanish as second principal language)",
    currency: "US Dollar (USD)",
    visaRequirements: "Portuguese citizens can enter the US without a visa under the Visa Waiver Program (VWP) for tourism or business stays of up to 90 days. An ESTA (Electronic System for Travel Authorization) must be obtained before boarding. Cost: USD 21.",
    passportRequirements: "Valid Portuguese e-Passport required. A minimum validity of 6 months beyond the return date is recommended. National ID cards are not accepted.",
    etiasRequirements: "Not applicable in the US. Instead, the ESTA (Electronic System for Travel Authorization) is mandatory — valid for 2 years or until passport expiry. Cost: USD 21.",
    vaccineRequirements: "No mandatory vaccinations to enter the US. Travel health insurance is strongly recommended due to the high cost of medical care.",
    safetyScore: 7,
    emergencyNumbers: "911 (Police, Ambulance and Fire)",
    travelWarnings: "Medical travel insurance is essential given the high cost of healthcare. Be aware of specific local safety advisories in major metropolitan areas.",
    avgHotelPrice: 140,
    avgMealPrice: 25,
    avgTransportCost: 3.5,
    costLivingIndex: 85,
    climateType: "Highly Diverse",
    climateDetails: "From tropical regions in Florida and Hawaii, through arid deserts in Nevada, to harsh northern winters and subarctic conditions in Alaska.",
    topAttractions: [
      {
        name: "Statue of Liberty (New York)",
        description: "An iconic monument on Liberty Island that greeted millions of immigrants arriving by ship into New York Harbour.",
        imageUrl: "/attractions/us-1.jpg",
      },
      {
        name: "Grand Canyon (Arizona)",
        description: "One of the world's greatest natural wonders, carved by the Colorado River over millions of years into breathtaking red-rock cliffs.",
        imageUrl: "/attractions/us-2.jpg",
      },
      {
        name: "Golden Gate Bridge (San Francisco)",
        description: "Spanning the Golden Gate strait, one of the most recognisable bridges on the planet with its distinctive international orange hue.",
        imageUrl: "/attractions/us-3.jpg",
      }
    ],
    majorCities: ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"],
    bestTimeVisit: "May to September (excellent weather for national parks and beaches)",
    powerPlugType: "Type A / B (120V, 60Hz)",
    internetQualityScore: 9,
    transportQualityScore: 6,
    healthcareQualityScore: 8,
    imageUrl: "/covers/us.jpg",
    flagEmoji: "🇺🇸",
    tagline: "Great metropolises, global pop culture and cinematic open roads.",
    description: "The United States is synonymous with vastness and dynamism. Home to entire industries built around cinema, technological innovation, world-class theme parks and awe-inspiring national parks, it offers unforgettable urban and geographic contrasts at every turn."
  },
  {
    id: "7",
    name: "Japan",
    slug: "japan",
    isoCode: "JP",
    capital: "Tokyo",
    continent: "Ásia",
    population: 125700000,
    languages: "Japanese",
    currency: "Japanese Yen (JPY)",
    visaRequirements: "Portuguese citizens can enter Japan without a visa for tourist stays of up to 90 days. No prior online registration is required — simply present your passport on arrival.",
    passportRequirements: "Valid Portuguese passport for the duration of the stay. A minimum validity of 6 months beyond the return date is recommended. National ID cards are not accepted.",
    etiasRequirements: "Not applicable in Japan. Direct entry with a passport — no prior electronic authorisation required.",
    vaccineRequirements: "No mandatory vaccinations to enter Japan. Keeping routine vaccines up to date is recommended.",
    safetyScore: 10,
    emergencyNumbers: "110 (Police), 119 (Ambulance and Fire)",
    travelWarnings: "Exceptionally safe country with very low crime rates. Natural earthquake risk is monitored by government systems with automatic public alerts.",
    avgHotelPrice: 90,
    avgMealPrice: 12,
    avgTransportCost: 3.0,
    costLivingIndex: 72,
    climateType: "Temperate / Alpine",
    climateDetails: "Four stunning seasons: cherry blossoms in spring, crimson foliage in autumn, hot and humid summers, and spectacular snowy winters in the north.",
    topAttractions: [
      {
        name: "Mount Fuji",
        description: "The country's highest volcanic peak — Japan's most iconic cultural symbol, snow-capped for most of the year.",
        imageUrl: "/attractions/jp-1.jpg",
      },
      {
        name: "Fushimi Inari Shrine (Kyoto)",
        description: "A famous trail of over 10,000 vibrant vermilion torii gates winding up a sacred mountain.",
        imageUrl: "/attractions/jp-2.jpg",
      },
      {
        name: "Shibuya Crossing (Tokyo)",
        description: "The busiest pedestrian crossing in the world, located at the heart of Tokyo's buzzing commercial and tech district.",
        imageUrl: "/attractions/jp-3.jpg",
      }
    ],
    majorCities: ["Tokyo", "Kyoto", "Osaka", "Sapporo", "Fukuoka"],
    bestTimeVisit: "March to May (cherry blossoms — Sakura) and October to November (autumn foliage)",
    powerPlugType: "Type A / B (100V, 50/60Hz)",
    internetQualityScore: 9,
    transportQualityScore: 10,
    healthcareQualityScore: 9,
    imageUrl: "/covers/jp.jpg",
    flagEmoji: "🇯🇵",
    tagline: "Cutting-edge technology fused with millennia of tradition.",
    description: "Japan captivates with its seamless blend of past and future — silent wooden temples standing beside neon-lit skyscrapers, ancient tea ceremonies alongside robot restaurants. With world-class cuisine and the finest high-speed rail network on earth, it is a safe and endlessly fascinating refuge."
  },
  {
    id: "8",
    name: "United Kingdom",
    slug: "united-kingdom",
    isoCode: "GB",
    capital: "London",
    continent: "Europa",
    population: 67320000,
    languages: "English",
    currency: "Pound Sterling (GBP)",
    visaRequirements: "Since Brexit, Portuguese citizens (EU) no longer have automatic residency rights in the UK. For tourism up to 6 months, no visa is required, but an ETA (Electronic Travel Authorisation) must be obtained before boarding. Cost: £10.",
    passportRequirements: "A valid Portuguese passport is mandatory. National ID cards have not been accepted in the UK since Brexit. A minimum validity of 6 months is recommended.",
    etiasRequirements: "Not applicable. Instead of ETIAS, the UK requires its own ETA (Electronic Travel Authorisation), applied for before travel via the official UK government website.",
    vaccineRequirements: "No mandatory vaccinations for Portuguese citizens travelling to the United Kingdom.",
    safetyScore: 8,
    emergencyNumbers: "999 (General Emergencies), 111 (Non-emergency medical)",
    travelWarnings: "Very safe. Be alert to phone and wallet theft in dense urban areas of London and at major sporting events.",
    avgHotelPrice: 115,
    avgMealPrice: 18,
    avgTransportCost: 3.2,
    costLivingIndex: 76,
    climateType: "Temperate Maritime",
    climateDetails: "Highly changeable and rainy. Cold, damp winters and moderately warm, often overcast summers.",
    topAttractions: [
      {
        name: "Big Ben & Parliament (London)",
        description: "The Elizabeth Tower clock and the seat of British government on the banks of the River Thames — symbols of the nation.",
        imageUrl: "/attractions/gb-1.jpg",
      },
      {
        name: "Edinburgh Castle",
        description: "A mighty historic fortress dominating the Scottish capital's skyline from the top of the volcanic Castle Rock.",
        imageUrl: "/attractions/gb-2.jpg",
      },
      {
        name: "Stonehenge (Wiltshire)",
        description: "A mysterious circle of giant prehistoric monoliths erected during the Neolithic period on Salisbury Plain.",
        imageUrl: "/attractions/gb-3.jpg",
      }
    ],
    majorCities: ["London", "Edinburgh", "Manchester", "Birmingham", "Glasgow"],
    bestTimeVisit: "May to September (long, sunny days with ideal temperatures for sightseeing)",
    powerPlugType: "Type G (230V, 50Hz)",
    internetQualityScore: 9,
    transportQualityScore: 8,
    healthcareQualityScore: 9,
    imageUrl: "/covers/gb.jpg",
    flagEmoji: "🇬🇧",
    tagline: "Medieval castles, royal palaces and spectacular bucolic landscapes.",
    description: "The United Kingdom holds centuries of history in its medieval streets, imposing Gothic cathedrals and royal castles. Home to one of the world's greatest literary, music and theatre industries, it pairs breathtaking rural routes with globally influential dynamic capitals."
  },
  {
    id: "9",
    name: "Italy",
    slug: "italy",
    isoCode: "IT",
    capital: "Rome",
    continent: "Europa",
    population: 59000000,
    languages: "Italian",
    currency: "Euro (EUR)",
    visaRequirements: "Portuguese citizens enjoy full freedom of movement within the EU. Entry to Italy requires no visa — a national ID card or passport is sufficient, with no time limit.",
    passportRequirements: "A valid Portuguese national ID card is sufficient. Italy and Portugal share the Schengen Area — no border controls exist.",
    etiasRequirements: "Not applicable — EU citizens are exempt from ETIAS.",
    vaccineRequirements: "No mandatory vaccinations for Portuguese citizens travelling to Italy.",
    safetyScore: 8,
    emergencyNumbers: "112, 113 (Police), 118 (Ambulance)",
    travelWarnings: "Generally safe. High pickpocket activity at Rome's and Florence's most famous monuments and on intercity express trains.",
    avgHotelPrice: 90,
    avgMealPrice: 18,
    avgTransportCost: 2.0,
    costLivingIndex: 65,
    climateType: "Mediterranean",
    climateDetails: "Very hot, dry summers on the central plains and in the south, mild winters with occasional rain. The northern Alpine region experiences cold winters and heavy snowfall.",
    topAttractions: [
      {
        name: "Colosseum (Rome)",
        description: "The largest amphitheatre of classical antiquity, built by the Roman Empire at the heart of the Eternal City.",
        imageUrl: "/attractions/it-1.jpg",
      },
      {
        name: "Florence Cathedral (Duomo)",
        description: "The Cathedral of Santa Maria del Fiore, crowned by Filippo Brunelleschi's monumental red-brick dome — an engineering marvel of the Renaissance.",
        imageUrl: "/attractions/it-2.jpg",
      },
      {
        name: "Amalfi Coast (Campania)",
        description: "A breathtaking mountainous coastline of colourful fishing villages clinging to cliffs above a sapphire-blue sea.",
        imageUrl: "/attractions/it-3.jpg",
      }
    ],
    majorCities: ["Rome", "Milan", "Florence", "Venice", "Naples"],
    bestTimeVisit: "April to June and September to October (avoiding the intense Italian summer heat in July and August)",
    powerPlugType: "Type C / L / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 7,
    healthcareQualityScore: 9,
    imageUrl: "/covers/it.jpg",
    flagEmoji: "🇮🇹",
    tagline: "Legendary ancient ruins, romantic canals and the world's finest food.",
    description: "Italy has more UNESCO World Heritage Sites than any other country on earth. Home of the Renaissance, imposing Roman ruins, unforgettable museums and a cuisine universally adored — pizza, pasta, gelato and exceptional wines — it delivers cultural charm at every turn."
  }
];
