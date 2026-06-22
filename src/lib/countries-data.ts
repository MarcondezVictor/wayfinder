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
    capital: "Lisboa",
    continent: "Europa",
    population: 10300000,
    languages: "Português",
    currency: "Euro (EUR)",
    visaRequirements: "Não aplicável — Portugal é o destino. Cidadãos portugueses residem e circulam livremente.",
    passportRequirements: "Não aplicável.",
    etiasRequirements: "Não aplicável — cidadãos da UE estão isentos de ETIAS.",
    vaccineRequirements: "Nenhuma vacina obrigatória para residentes em Portugal.",
    safetyScore: 9,
    emergencyNumbers: "112 (Emergência Nacional)",
    travelWarnings: null,
    avgHotelPrice: 75,
    avgMealPrice: 15,
    avgTransportCost: 2.5,
    costLivingIndex: 55,
    climateType: "Mediterrânico",
    climateDetails: "Invernos suaves com alguma chuva e verões longos, secos e quentes. Algarve conta com mais de 300 dias de sol por ano.",
    topAttractions: [
      {
        name: "Torre de Belém (Lisboa)",
        description: "Monumento gótico manuelino que servia de fortificação e ponto de partida para os Descobrimentos marítimos.",
        imageUrl: "/attractions/pt-1.jpg",
      },
      {
        name: "Palácio da Pena (Sintra)",
        description: "Exponente máximo do romantismo arquitetónico português no topo da serra de Sintra.",
        imageUrl: "/attractions/pt-2.jpg",
      },
      {
        name: "Ponte Luís I (Porto)",
        description: "Ponte metálica em arco de dois tabuleiros ligando o Porto a Vila Nova de Gaia sobre o rio Douro.",
        imageUrl: "/attractions/pt-3.jpg",
      }
    ],
    majorCities: ["Lisboa", "Porto", "Coimbra", "Braga", "Faro"],
    bestTimeVisit: "Abril a Outubro (Primavera e Outono são ideais para passeios e Verão para praia)",
    powerPlugType: "Tipo C / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 8,
    healthcareQualityScore: 9,
    imageUrl: "/covers/pt.jpg",
    flagEmoji: "🇵🇹",
    tagline: "Terra de descobridores, praias douradas e história vibrante.",
    description: "Portugal junta um legado cultural e histórico profundo a um dos melhores climas da Europa. Célebre pelo fado, pela hospitalidade, pela gastronomia rica em mariscos e pelos pastéis de nata, o país atrai cada vez mais estudantes, nómadas digitais e viajantes de todo o mundo."
  },
  {
    id: "2",
    name: "Brasil",
    slug: "brazil",
    isoCode: "BR",
    capital: "Brasília",
    continent: "América do Sul",
    population: 214300000,
    languages: "Português",
    currency: "Real (BRL)",
    visaRequirements: "Cidadãos portugueses (UE) entram sem visto no Brasil para turismo por até 90 dias, prorrogáveis por mais 90 dias (máximo 180 dias por ano).",
    passportRequirements: "Passaporte português válido pela duração da estadia. Recomenda-se validade mínima de 6 meses além da data de regresso.",
    etiasRequirements: "Não aplicável — o Brasil não exige ETIAS. Entrada direta com passaporte.",
    vaccineRequirements: "Vacina contra febre amarela obrigatória para visitar a Amazónia, Pantanal ou estados do centro-oeste. Recomenda-se também a vacina contra febre tifoide e hepatite A.",
    safetyScore: 5,
    emergencyNumbers: "190 (Polícia Militar), 192 (SAMU), 193 (Bombeiros)",
    travelWarnings: "Atenção redobrada nas grandes metrópoles. Evitar caminhar à noite em áreas desertas ou favelas sem guias autorizados.",
    avgHotelPrice: 45,
    avgMealPrice: 8,
    avgTransportCost: 1.2,
    costLivingIndex: 38,
    climateType: "Tropical / Equatorial",
    climateDetails: "Clima quente e húmido na maior parte do ano. O norte e nordeste são predominantemente tropicais, enquanto o sul tem as quatro estações delineadas com invernos frescos.",
    topAttractions: [
      {
        name: "Cristo Redentor (Rio de Janeiro)",
        description: "Estátua art déco gigante no topo do morro do Corcovado, de onde se vê toda a baía do Rio.",
        imageUrl: "/attractions/br-1.jpg",
      },
      {
        name: "Cataratas do Iguaçu (Paraná)",
        description: "O maior sistema de quedas de água do mundo, rodeado por uma floresta tropical biodiversa.",
        imageUrl: "/attractions/br-2.jpg",
      },
      {
        name: "Pelourinho (Salvador)",
        description: "Centro histórico de Salvador com ricas fachadas coloniais portuguesas e manifestações da cultura afro-brasileira.",
        imageUrl: "/attractions/br-3.jpg",
      }
    ],
    majorCities: ["São Paulo", "Rio de Janeiro", "Salvador", "Belo Horizonte", "Curitiba"],
    bestTimeVisit: "Dezembro a Março (para o Carnaval e Verão) ou Junho a Setembro (para climas mais amenos no sul)",
    powerPlugType: "Tipo N (220V ou 127V, 60Hz)",
    internetQualityScore: 7,
    transportQualityScore: 5,
    healthcareQualityScore: 6,
    imageUrl: "/covers/br.jpg",
    flagEmoji: "🇧🇷",
    tagline: "Ritmo, praias tropicais e a maior floresta do planeta.",
    description: "O Brasil é uma explosão de energia, diversidade cultural e belezas naturais sem paralelo. Da imensidão verde da Amazónia às praias do Rio de Janeiro, o país é famoso pela sua música, paixão pelo futebol, churrasco e uma das comunidades mais alegres do mundo."
  },
  {
    id: "3",
    name: "Ucrânia",
    slug: "ukraine",
    isoCode: "UA",
    capital: "Kyiv",
    continent: "Europa",
    population: 38000000,
    languages: "Ucraniano",
    currency: "Hryvnia (UAH)",
    visaRequirements: "Desaconselhado — conflito armado em curso. Em condições normais, cidadãos portugueses (UE) podiam entrar sem visto por até 90 dias. Consulte o Ministério dos Negócios Estrangeiros antes de qualquer viagem.",
    passportRequirements: "Passaporte português válido. Em condições normais, validade mínima de 3 meses além da data de saída prevista.",
    etiasRequirements: "Não aplicável — a Ucrânia não pertence ao espaço Schengen nem exige ETIAS.",
    vaccineRequirements: "Nenhuma vacina obrigatória. Recomenda-se manter as vacinas de rotina atualizadas (tétano, hepatite A).",
    safetyScore: 3,
    emergencyNumbers: "101 (Bombeiros), 102 (Polícia), 103 (Ambulância), 112 (Emergência Geral)",
    travelWarnings: "Estado de alerta em vigor devido ao conflito ativo. Fortemente desaconselhado qualquer viagem turística para o território atualmente.",
    avgHotelPrice: 30,
    avgMealPrice: 6,
    avgTransportCost: 0.5,
    costLivingIndex: 32,
    climateType: "Continental Moderado",
    climateDetails: "Invernos frios e com bastante neve; verões amenos e quentes. A sul, na costa do Mar Negro, o clima é historicamente mais temperado.",
    topAttractions: [
      {
        name: "Catedral de Santa Sofia (Kyiv)",
        description: "Monumento medieval excecional fundado no século XI, famoso pelas suas cúpulas douradas e mosaicos bizantinos originais.",
        imageUrl: "/attractions/ua-1.jpg",
      },
      {
        name: "Centro Histórico de Lviv",
        description: "Uma jóia da Europa de Leste com calçadas de paralelepípedos, arquitetura renascentista e uma cultura de café lendária.",
        imageUrl: "/attractions/ua-2.jpg",
      },
      {
        name: "Montanhas dos Cárpatos",
        description: "Florestas densas de pinheiros, rios límpidos e a cultura tradicional Hutsul na região montanhosa a oeste do país.",
        imageUrl: "/attractions/ua-3.jpg",
      }
    ],
    majorCities: ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"],
    bestTimeVisit: "Maio a Setembro (quando as temperaturas estão agradáveis e os parques floridos)",
    powerPlugType: "Tipo C / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 7,
    healthcareQualityScore: 7,
    imageUrl: "/covers/ua.jpg",
    flagEmoji: "🇺🇦",
    tagline: "Corações corajosos, cúpulas douradas e campos de trigo dourados.",
    description: "A Ucrânia é a terra dos contrastes culturais na Europa Oriental. Conhecida pelas suas magníficas catedrais de cúpulas brilhantes, história cossaca, festivais folclóricos e um ecossistema tecnológico altamente dinâmico e resiliente."
  },
  {
    id: "4",
    name: "França",
    slug: "france",
    isoCode: "FR",
    capital: "Paris",
    continent: "Europa",
    population: 68000000,
    languages: "Francês",
    currency: "Euro (EUR)",
    visaRequirements: "Cidadãos portugueses têm liberdade de circulação total na UE. Entrada em França sem qualquer visto, com Cartão de Cidadão ou passaporte, por tempo ilimitado.",
    passportRequirements: "Cartão de Cidadão português válido é suficiente para entrar e permanecer em França. Passaporte opcional.",
    etiasRequirements: "Não aplicável — cidadãos da UE estão isentos de ETIAS.",
    vaccineRequirements: "Nenhuma vacina obrigatória para cidadãos portugueses que viajam para França.",
    safetyScore: 8,
    emergencyNumbers: "112, 15 (Ambulância), 17 (Polícia), 18 (Bombeiros)",
    travelWarnings: "Atenção a carteiristas e esquemas em grandes pontos turísticos em Paris. Manifestações políticas podem ocorrer com frequência.",
    avgHotelPrice: 110,
    avgMealPrice: 20,
    avgTransportCost: 2.1,
    costLivingIndex: 78,
    climateType: "Temperado / Oceânico",
    climateDetails: "Invernos frescos e verões amenos no norte. Clima mediterrânico agradável com verões quentes e invernos secos e suaves no sul.",
    topAttractions: [
      {
        name: "Torre Eiffel (Paris)",
        description: "O maior ícone francês do mundo, uma estrutura monumental de ferro construída em 1889 na margem do rio Sena.",
        imageUrl: "/attractions/fr-1.jpg",
      },
      {
        name: "Palácio de Versalhes",
        description: "Antiga residência dos reis de França, famosa pelos seus salões espelhados deslumbrantes e jardins geométricos.",
        imageUrl: "/attractions/fr-2.jpg",
      },
      {
        name: "Mont Saint-Michel (Normandia)",
        description: "Ilha rochosa fortificada com uma abadia gótica medieval espetacular cercada por uma das marés mais extremas da Europa.",
        imageUrl: "/attractions/fr-3.jpg",
      }
    ],
    majorCities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    bestTimeVisit: "Maio a Outubro (Primavera para evitar multidões e Verão na Côte d'Azur)",
    powerPlugType: "Tipo C / E (230V, 50Hz)",
    internetQualityScore: 9,
    transportQualityScore: 9,
    healthcareQualityScore: 10,
    imageUrl: "/covers/fr.jpg",
    flagEmoji: "🇫🇷",
    tagline: "O centro global da arte, culinária fina, moda e romance.",
    description: "França tem sido o destino turístico mais popular do mundo devido ao seu inestimável património artístico, moda de alta-costura, culinária gourmet requintada e regiões vinícolas famosas. Do charme metropolitano parisiense às vinhas do sul, oferece experiências extraordinárias."
  },
  {
    id: "5",
    name: "Espanha",
    slug: "spain",
    isoCode: "ES",
    capital: "Madrid",
    continent: "Europa",
    population: 47400000,
    languages: "Espanhol (Castelhano), Catalão, Galego, Basco",
    currency: "Euro (EUR)",
    visaRequirements: "Cidadãos portugueses têm liberdade de circulação total na UE. Entrada em Espanha sem qualquer visto, com Cartão de Cidadão ou passaporte, por tempo ilimitado.",
    passportRequirements: "Cartão de Cidadão português válido é suficiente. Espanha e Portugal partilham o Espaço Schengen — não existe controlo de fronteiras.",
    etiasRequirements: "Não aplicável — cidadãos da UE estão isentos de ETIAS.",
    vaccineRequirements: "Nenhuma vacina obrigatória para cidadãos portugueses que viajam para Espanha.",
    safetyScore: 8,
    emergencyNumbers: "112 (Emergência Geral), 091 (Polícia)",
    travelWarnings: "Muito seguro. Cuidado com carteiristas no metro e Ramblas em Barcelona ou praças em Madrid.",
    avgHotelPrice: 85,
    avgMealPrice: 15,
    avgTransportCost: 1.8,
    costLivingIndex: 60,
    climateType: "Mediterrânico / Semiárido",
    climateDetails: "Verões quentes e secos e invernos amenos com chuvas. A zona central (Madrid) apresenta temperaturas continentais extremas no Verão e Inverno.",
    topAttractions: [
      {
        name: "Sagrada Família (Barcelona)",
        description: "A colossal basílica de Antoni Gaudí, expoente máximo do modernismo catalão ainda em conclusão.",
        imageUrl: "/attractions/es-1.jpg",
      },
      {
        name: "Alhambra (Granada)",
        description: "Magnífico palácio e fortaleza mourisca que testemunha o apogeu da arte islâmica medieval em Espanha.",
        imageUrl: "/attractions/es-2.jpg",
      },
      {
        name: "Plaza de España (Sevilha)",
        description: "Belo palácio e canal semi-circular construído em 1928 que exibe o esplendor da azulejaria andaluza.",
        imageUrl: "/attractions/es-3.jpg",
      }
    ],
    majorCities: ["Madrid", "Barcelona", "Sevilla", "Valencia", "Bilbao"],
    bestTimeVisit: "Abril a Junho e Setembro a Outubro (temperaturas ótimas para explorar sem o calor sufocante do Verão)",
    powerPlugType: "Tipo C / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 8,
    healthcareQualityScore: 9,
    imageUrl: "/covers/es.jpg",
    flagEmoji: "🇪🇸",
    tagline: "Cultura andaluza, monumentos medievais e sol eterno.",
    description: "A Espanha junta sol, história e o estilo de vida vibrante das suas ruas. Conhecida pelas noites de tapas, siestas, festivais espetaculares, arquitetura mourisca requintada e praias mediterrânicas, é uma escolha imperdível para residir ou passear."
  },
  {
    id: "6",
    name: "Estados Unidos",
    slug: "united-states",
    isoCode: "US",
    capital: "Washington D.C.",
    continent: "América do Norte",
    population: 331900000,
    languages: "Inglês (e Espanhol como segunda principal)",
    currency: "Dólar Americano (USD)",
    visaRequirements: "Cidadãos portugueses entram nos EUA sem visto ao abrigo do Visa Waiver Program (VWP) para estadias turísticas ou de negócios até 90 dias. Obrigatório obter autorização ESTA antes de embarcar.",
    passportRequirements: "Passaporte eletrónico português válido. Recomenda-se validade mínima de 6 meses além da data de regresso. Cartão de Cidadão não é aceite.",
    etiasRequirements: "Não aplicável nos EUA. Em substituição, é obrigatória a autorização ESTA (Electronic System for Travel Authorization), válida por 2 anos ou até expirar o passaporte. Custo: 21 USD.",
    vaccineRequirements: "Nenhuma vacina obrigatória para entrar nos EUA. Recomenda-se seguro de saúde de viagem devido aos elevados custos médicos americanos.",
    safetyScore: 7,
    emergencyNumbers: "911 (Polícia, Ambulância e Bombeiros)",
    travelWarnings: "Seguro de viagem médica é obrigatório devido aos custos exorbitantes da saúde. Atenção aos avisos de segurança locais específicos em grandes áreas metropolitanas.",
    avgHotelPrice: 140,
    avgMealPrice: 25,
    avgTransportCost: 3.5,
    costLivingIndex: 85,
    climateType: "Muito Diverso",
    climateDetails: "Das regiões tropicais na Flórida e Havai, passando por desertos áridos no Nevada, até aos invernos rigorosos e frios no norte e subárticos no Alasca.",
    topAttractions: [
      {
        name: "Estátua da Liberdade (New York)",
        description: "Monumento icónico na Liberty Island que recebia os barcos de imigrantes na baía de Nova Iorque.",
        imageUrl: "/attractions/us-1.jpg",
      },
      {
        name: "Grand Canyon (Arizona)",
        description: "Uma das maiores maravilhas naturais do mundo esculpida pelo rio Colorado com impressionantes penhascos vermelhos.",
        imageUrl: "/attractions/us-2.jpg",
      },
      {
        name: "Ponte Golden Gate (San Francisco)",
        description: "Suspensa sobre o estreito de Golden Gate, uma das pontes mais reconhecíveis do planeta com a sua cor laranja característica.",
        imageUrl: "/attractions/us-3.jpg",
      }
    ],
    majorCities: ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"],
    bestTimeVisit: "Maio a Setembro (excelente tempo para parques nacionais e praias)",
    powerPlugType: "Tipo A / B (120V, 60Hz)",
    internetQualityScore: 9,
    transportQualityScore: 6,
    healthcareQualityScore: 8,
    imageUrl: "/covers/us.jpg",
    flagEmoji: "🇺🇸",
    tagline: "Grandes metrópoles, cultura pop global e estradas cinematográficas.",
    description: "Os Estados Unidos são sinónimo de imensidão e dinamismo. Lar de indústrias inteiras de cinema, inovação tecnológica, parques de diversão de classe mundial e parques nacionais impressionantes, o país oferece contrastes urbanos e geográficos inesquecíveis."
  },
  {
    id: "7",
    name: "Japão",
    slug: "japan",
    isoCode: "JP",
    capital: "Tóquio",
    continent: "Ásia",
    population: 125700000,
    languages: "Japonês",
    currency: "Iene Japonês (JPY)",
    visaRequirements: "Cidadãos portugueses entram no Japão sem visto para estadias turísticas até 90 dias. Não é necessário qualquer registo prévio online — basta apresentar o passaporte na chegada.",
    passportRequirements: "Passaporte português válido pela duração da estadia. Recomenda-se validade mínima de 6 meses além da data de regresso. Cartão de Cidadão não é aceite.",
    etiasRequirements: "Não aplicável no Japão. Entrada direta com passaporte, sem qualquer autorização eletrónica prévia.",
    vaccineRequirements: "Nenhuma vacina obrigatória para entrar no Japão. Vacinas de rotina atualizadas são recomendadas.",
    safetyScore: 10,
    emergencyNumbers: "110 (Polícia), 119 (Ambulância e Bombeiros)",
    travelWarnings: "País excecionalmente seguro. Raros crimes comuns. Risco natural de terramotos monitorizados pelo governo com sistemas automáticos de aviso.",
    avgHotelPrice: 90,
    avgMealPrice: 12,
    avgTransportCost: 3.0,
    costLivingIndex: 72,
    climateType: "Temperado / Alpino",
    climateDetails: "Quatro estações deslumbrantes. Primavera com a floração das cerejeiras, Outono com as folhas carmesim, Verões quentes e húmidos e invernos nevados fantásticos a norte.",
    topAttractions: [
      {
        name: "Monte Fuji",
        description: "O pico vulcânico mais alto do país, símbolo da identidade cultural japonesa envolto em neve na maior parte do ano.",
        imageUrl: "/attractions/jp-1.jpg",
      },
      {
        name: "Santuário Fushimi Inari (Kyoto)",
        description: "Famoso trilho de mais de 10.000 portões torii cor-de-laranja vibrantes que sobem a montanha sagrada.",
        imageUrl: "/attractions/jp-2.jpg",
      },
      {
        name: "Cruzamento de Shibuya (Tóquio)",
        description: "A passadeira de peões mais movimentada do mundo, localizada no centro tecnológico da metrópole asiática.",
        imageUrl: "/attractions/jp-3.jpg",
      }
    ],
    majorCities: ["Tokyo", "Kyoto", "Osaka", "Sapporo", "Fukuoka"],
    bestTimeVisit: "Março a Maio (floração das cerejeiras - Sakura) e Outubro a Novembro (folhagens de outono)",
    powerPlugType: "Tipo A / B (100V, 50/60Hz)",
    internetQualityScore: 9,
    transportQualityScore: 10,
    healthcareQualityScore: 9,
    imageUrl: "/covers/jp.jpg",
    flagEmoji: "🇯🇵",
    tagline: "Tecnologia de ponta fundida com tradições milenares.",
    description: "O Japão fascina pela união perfeita entre o passado e o futuro. Aqui poderá encontrar templos de madeira silenciosos ao lado de arranha-céus cobertos de néon e robôs. Com uma gastronomia de alta qualidade técnica e a melhor rede de comboios de alta velocidade, é um refúgio seguro e fascinante."
  },
  {
    id: "8",
    name: "Reino Unido",
    slug: "united-kingdom",
    isoCode: "GB",
    capital: "Londres",
    continent: "Europa",
    population: 67320000,
    languages: "Inglês",
    currency: "Libra Esterlina (GBP)",
    visaRequirements: "Após o Brexit, cidadãos portugueses (UE) perderam o direito de residência automática no RU. Para turismo até 6 meses, não é necessário visto mas é obrigatório obter uma ETA (Electronic Travel Authorisation) antes de embarcar. Custo: £10.",
    passportRequirements: "Passaporte português válido obrigatório. Cartão de Cidadão não é aceite no Reino Unido desde o Brexit. Recomenda-se validade mínima de 6 meses.",
    etiasRequirements: "Não aplicável. Em substituição do ETIAS, o Reino Unido exige a sua própria ETA (Electronic Travel Authorisation). Deve ser solicitada antes de viajar através do site oficial do governo britânico.",
    vaccineRequirements: "Nenhuma vacina obrigatória para cidadãos portugueses que viajam para o Reino Unido.",
    safetyScore: 8,
    emergencyNumbers: "999 (Emergências gerais), 111 (Não-emergências médicas)",
    travelWarnings: "Muito seguro. Cuidado com furtos de telemóveis e carteiras em zonas urbanas densas de Londres e eventos desportivos.",
    avgHotelPrice: 115,
    avgMealPrice: 18,
    avgTransportCost: 3.2,
    costLivingIndex: 76,
    climateType: "Temperado Marítimo",
    climateDetails: "Muito mutável e chuvoso. Invernos frios e húmidos e verões moderadamente quentes e nublados.",
    topAttractions: [
      {
        name: "Big Ben & Parlamento (Londres)",
        description: "A torre do relógio Elizabeth Tower e a sede do governo britânico nas margens do rio Tamisa.",
        imageUrl: "/attractions/gb-1.jpg",
      },
      {
        name: "Castelo de Edimburgo",
        description: "Fortaleza histórica imponente que domina o horizonte da capital da Escócia no topo do vulcânico Castle Rock.",
        imageUrl: "/attractions/gb-2.jpg",
      },
      {
        name: "Stonehenge (Wiltshire)",
        description: "Círculo misterioso de monólitos gigantescos de pedra construído no período neolítico em Salisbury Plain.",
        imageUrl: "/attractions/gb-3.jpg",
      }
    ],
    majorCities: ["London", "Edinburgh", "Manchester", "Birmingham", "Glasgow"],
    bestTimeVisit: "Maio a Setembro (quando os dias são longos, ensolarados e as temperaturas ideais para passear)",
    powerPlugType: "Tipo G (230V, 50Hz)",
    internetQualityScore: 9,
    transportQualityScore: 8,
    healthcareQualityScore: 9,
    imageUrl: "/covers/gb.jpg",
    flagEmoji: "🇬🇧",
    tagline: "Castelos medievais, palácios reais e paisagens bucólicas espetaculares.",
    description: "O Reino Unido guarda séculos de história nas suas ruas medievais, catedrais góticas imponentes e castelos reais. Lar de uma das maiores indústrias literárias, de música e teatros do mundo, proporciona rotas rurais deslumbrantes misturadas a capitais globais dinâmicas."
  },
  {
    id: "9",
    name: "Itália",
    slug: "italy",
    isoCode: "IT",
    capital: "Roma",
    continent: "Europa",
    population: 59000000,
    languages: "Italiano",
    currency: "Euro (EUR)",
    visaRequirements: "Cidadãos portugueses têm liberdade de circulação total na UE. Entrada em Itália sem qualquer visto, com Cartão de Cidadão ou passaporte, por tempo ilimitado.",
    passportRequirements: "Cartão de Cidadão português válido é suficiente. Itália e Portugal partilham o Espaço Schengen — não existe controlo de fronteiras.",
    etiasRequirements: "Não aplicável — cidadãos da UE estão isentos de ETIAS.",
    vaccineRequirements: "Nenhuma vacina obrigatória para cidadãos portugueses que viajam para Itália.",
    safetyScore: 8,
    emergencyNumbers: "112, 113 (Polícia), 118 (Ambulância)",
    travelWarnings: "Bastante seguro. Elevada atividade de batedores de carteiras nos monumentos mais famosos de Roma, Florença e comboios expressos.",
    avgHotelPrice: 90,
    avgMealPrice: 18,
    avgTransportCost: 2.0,
    costLivingIndex: 65,
    climateType: "Mediterrânico",
    climateDetails: "Verões muito quentes e secos nas planícies centrais e a sul, invernos amenos com episódios de chuva. O norte junto aos Alpes é frio e com neve.",
    topAttractions: [
      {
        name: "Coliseu (Roma)",
        description: "O maior anfiteatro da Antiguidade clássica construído pelo Império Romano no centro histórico da capital.",
        imageUrl: "/attractions/it-1.jpg",
      },
      {
        name: "Duomo de Florença",
        description: "A catedral de Santa Maria del Fiore com a sua monumental cúpula de tijolos vermelhos projetada por Filippo Brunelleschi.",
        imageUrl: "/attractions/it-2.jpg",
      },
      {
        name: "Costa Amalfitana (Campânia)",
        description: "Região costeira montanhosa deslumbrante de vilas coloridas de pescadores suspensas sobre o mar azul-safira.",
        imageUrl: "/attractions/it-3.jpg",
      }
    ],
    majorCities: ["Roma", "Milão", "Florença", "Veneza", "Nápoles"],
    bestTimeVisit: "Abril a Junho e Setembro a Outubro (evitando a forte vaga de calor do Verão italiano em Julho e Agosto)",
    powerPlugType: "Tipo C / L / F (230V, 50Hz)",
    internetQualityScore: 8,
    transportQualityScore: 7,
    healthcareQualityScore: 9,
    imageUrl: "/covers/it.jpg",
    flagEmoji: "🇮🇹",
    tagline: "Ruínas antigas lendárias, canais românticos e a melhor comida do mundo.",
    description: "Itália é o país com maior número de patrimónios da UNESCO do planeta. Lar da renascença artística, das ruínas romanas imponentes, de museus inesquecíveis e de uma das culinárias mais amadas mundialmente (pizza, pasta, gelatos e vinhos de exceção), oferece charme cultural a cada recanto."
  }
];
