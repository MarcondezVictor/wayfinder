-- Atualização dos dados de entrada e vistos para cidadãos portugueses
-- Tabela: public.countries
-- Colunas: visa_requirements, passport_requirements, etias_requirements, vaccine_requirements

-- Portugal (PT)
UPDATE public.countries SET
  visa_requirements     = 'Não aplicável — Portugal é o destino. Cidadãos portugueses residem e circulam livremente.',
  passport_requirements = 'Não aplicável.',
  etias_requirements    = 'Não aplicável — cidadãos da UE estão isentos de ETIAS.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para residentes em Portugal.'
WHERE iso_code = 'PT';

-- Brasil (BR)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses (UE) entram sem visto no Brasil para turismo por até 90 dias, prorrogáveis por mais 90 dias (máximo 180 dias por ano).',
  passport_requirements = 'Passaporte português válido pela duração da estadia. Recomenda-se validade mínima de 6 meses além da data de regresso.',
  etias_requirements    = 'Não aplicável — o Brasil não exige ETIAS. Entrada direta com passaporte.',
  vaccine_requirements  = 'Vacina contra febre amarela obrigatória para visitar a Amazónia, Pantanal ou estados do centro-oeste. Recomenda-se também a vacina contra febre tifoide e hepatite A.'
WHERE iso_code = 'BR';

-- Ucrânia (UA)
UPDATE public.countries SET
  visa_requirements     = 'Desaconselhado — conflito armado em curso. Em condições normais, cidadãos portugueses (UE) podiam entrar sem visto por até 90 dias. Consulte o Ministério dos Negócios Estrangeiros antes de qualquer viagem.',
  passport_requirements = 'Passaporte português válido. Em condições normais, validade mínima de 3 meses além da data de saída prevista.',
  etias_requirements    = 'Não aplicável — a Ucrânia não pertence ao espaço Schengen nem exige ETIAS.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória. Recomenda-se manter as vacinas de rotina atualizadas (tétano, hepatite A).'
WHERE iso_code = 'UA';

-- França (FR)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses têm liberdade de circulação total na UE. Entrada em França sem qualquer visto, com Cartão de Cidadão ou passaporte, por tempo ilimitado.',
  passport_requirements = 'Cartão de Cidadão português válido é suficiente para entrar e permanecer em França. Passaporte opcional.',
  etias_requirements    = 'Não aplicável — cidadãos da UE estão isentos de ETIAS.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para cidadãos portugueses que viajam para França.'
WHERE iso_code = 'FR';

-- Espanha (ES)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses têm liberdade de circulação total na UE. Entrada em Espanha sem qualquer visto, com Cartão de Cidadão ou passaporte, por tempo ilimitado.',
  passport_requirements = 'Cartão de Cidadão português válido é suficiente. Espanha e Portugal partilham o Espaço Schengen — não existe controlo de fronteiras.',
  etias_requirements    = 'Não aplicável — cidadãos da UE estão isentos de ETIAS.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para cidadãos portugueses que viajam para Espanha.'
WHERE iso_code = 'ES';

-- Estados Unidos (US)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram nos EUA sem visto ao abrigo do Visa Waiver Program (VWP) para estadias turísticas ou de negócios até 90 dias. Obrigatório obter autorização ESTA antes de embarcar.',
  passport_requirements = 'Passaporte eletrónico português válido. Recomenda-se validade mínima de 6 meses além da data de regresso. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável nos EUA. Em substituição, é obrigatória a autorização ESTA (Electronic System for Travel Authorization), válida por 2 anos ou até expirar o passaporte. Custo: 21 USD.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para entrar nos EUA. Recomenda-se seguro de saúde de viagem devido aos elevados custos médicos americanos.'
WHERE iso_code = 'US';

-- Japão (JP)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram no Japão sem visto para estadias turísticas até 90 dias. Não é necessário qualquer registo prévio online — basta apresentar o passaporte na chegada.',
  passport_requirements = 'Passaporte português válido pela duração da estadia. Recomenda-se validade mínima de 6 meses além da data de regresso. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável no Japão. Entrada direta com passaporte, sem qualquer autorização eletrónica prévia.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para entrar no Japão. Vacinas de rotina atualizadas são recomendadas.'
WHERE iso_code = 'JP';

-- Reino Unido (GB)
UPDATE public.countries SET
  visa_requirements     = 'Após o Brexit, cidadãos portugueses (UE) perderam o direito de residência automática no RU. Para turismo até 6 meses, não é necessário visto mas é obrigatório obter uma ETA (Electronic Travel Authorisation) antes de embarcar. Custo: £10.',
  passport_requirements = 'Passaporte português válido obrigatório. Cartão de Cidadão não é aceite no Reino Unido desde o Brexit. Recomenda-se validade mínima de 6 meses.',
  etias_requirements    = 'Não aplicável. Em substituição do ETIAS, o Reino Unido exige a sua própria ETA (Electronic Travel Authorisation). Deve ser solicitada antes de viajar através do site oficial do governo britânico.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para cidadãos portugueses que viajam para o Reino Unido.'
WHERE iso_code = 'GB';

-- Itália (IT)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses têm liberdade de circulação total na UE. Entrada em Itália sem qualquer visto, com Cartão de Cidadão ou passaporte, por tempo ilimitado.',
  passport_requirements = 'Cartão de Cidadão português válido é suficiente. Itália e Portugal partilham o Espaço Schengen — não existe controlo de fronteiras.',
  etias_requirements    = 'Não aplicável — cidadãos da UE estão isentos de ETIAS.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para cidadãos portugueses que viajam para Itália.'
WHERE iso_code = 'IT';

-- Emirados Árabes Unidos (AE)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram nos Emirados Árabes Unidos sem visto para estadias turísticas até 90 dias. Visto concedido na chegada (Visa on Arrival) de forma gratuita e automática.',
  passport_requirements = 'Passaporte português válido com no mínimo 6 meses de validade além da data de saída. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável — os EAU não exigem ETIAS. Entrada direta com passaporte.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória. Recomenda-se vacina contra hepatite A e atualização das vacinas de rotina.'
WHERE iso_code = 'AE';

-- Austrália (AU)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses necessitam de um visto para entrar na Austrália. A opção mais simples para turismo é o ETA (Electronic Travel Authority, subclasse 601), totalmente online e gratuito, válido por 12 meses com estadias até 3 meses de cada vez.',
  passport_requirements = 'Passaporte eletrónico português válido. Recomenda-se validade mínima de 6 meses além da data de regresso. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável na Austrália. Em substituição, é obrigatória a autorização ETA (Electronic Travel Authority) ou eVisitor (subclasse 651), ambas gratuitas e processadas online.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para entrar na Austrália, exceto febre amarela se o viajante vier de país endémico. Recomenda-se vacina contra hepatite A e B.'
WHERE iso_code = 'AU';

-- Chile (CL)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram no Chile sem visto para estadias turísticas até 90 dias, prorrogáveis por mais 90 dias junto ao Departamento de Estrangeria chileno.',
  passport_requirements = 'Passaporte português válido com no mínimo 6 meses de validade além da data de saída. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável — o Chile não exige ETIAS. Entrada direta com passaporte.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória. Recomenda-se vacina contra febre tifoide e hepatite A para quem visita zonas rurais.'
WHERE iso_code = 'CL';

-- Egito (EG)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses necessitam de visto para entrar no Egito. Pode ser obtido online (e-Visa) antes de viajar ou Visa on Arrival no aeroporto. Custo aproximado: 25 USD. Válido por 30 dias.',
  passport_requirements = 'Passaporte português válido com no mínimo 6 meses de validade além da data de saída. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável — o Egito não exige ETIAS. Em substituição, é necessário o e-Visa egípcio ou Visa on Arrival.',
  vaccine_requirements  = 'Nenhuma vacina estritamente obrigatória para turistas. Recomenda-se vacina contra hepatite A, febre tifoide e atualização do tétano. Vacina contra febre amarela exigida se vier de país endémico.'
WHERE iso_code = 'EG';

-- Israel (IL)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram em Israel sem visto para estadias turísticas até 90 dias. Autorização concedida na chegada pelo oficial de fronteiras, sem necessidade de pedido prévio.',
  passport_requirements = 'Passaporte português válido com no mínimo 6 meses de validade além da data de saída. Cartão de Cidadão não é aceite. Nota: viagens anteriores a países árabes no passaporte podem causar questionamento na fronteira.',
  etias_requirements    = 'Não aplicável — Israel não exige ETIAS. Entrada direta com passaporte.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para entrar em Israel. Vacinas de rotina atualizadas são recomendadas.'
WHERE iso_code = 'IL';

-- Islândia (IS)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram na Islândia sem qualquer visto. A Islândia pertence ao Espaço Schengen (apesar de não ser membro da UE), pelo que a liberdade de circulação se aplica plenamente.',
  passport_requirements = 'Cartão de Cidadão português válido é suficiente para entrar e circular na Islândia. Passaporte opcional.',
  etias_requirements    = 'Não aplicável — cidadãos da UE estão isentos de ETIAS. A Islândia aplica as mesmas regras Schengen.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para cidadãos portugueses que viajam para a Islândia.'
WHERE iso_code = 'IS';

-- Marrocos (MA)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram em Marrocos sem visto para estadias até 90 dias. Basta apresentar o passaporte na chegada.',
  passport_requirements = 'Passaporte português válido com no mínimo 6 meses de validade além da data de saída. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável — Marrocos não exige ETIAS. Entrada direta com passaporte.',
  vaccine_requirements  = 'Nenhuma vacina estritamente obrigatória. Recomenda-se vacina contra hepatite A, febre tifoide e atualização do tétano para viagens ao interior ou zonas rurais.'
WHERE iso_code = 'MA';

-- Nova Zelândia (NZ)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses necessitam de uma NZeTA (New Zealand Electronic Travel Authority) antes de embarcar para a Nova Zelândia. O pedido é feito online ou pela app oficial. Custo: 23 NZD. Válida por 2 anos com estadias até 90 dias de cada vez.',
  passport_requirements = 'Passaporte eletrónico português válido. Recomenda-se validade mínima de 6 meses além da data de regresso. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável na Nova Zelândia. Em substituição, é obrigatória a NZeTA (New Zealand Electronic Travel Authority), solicitada online antes de viajar.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para entrar na Nova Zelândia, exceto febre amarela se vier de país endémico. Recomenda-se vacina contra hepatite A e B.'
WHERE iso_code = 'NZ';

-- Suécia (SE)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses têm liberdade de circulação total na UE. Entrada na Suécia sem qualquer visto, com Cartão de Cidadão ou passaporte, por tempo ilimitado.',
  passport_requirements = 'Cartão de Cidadão português válido é suficiente. Suécia e Portugal partilham o Espaço Schengen — não existe controlo de fronteiras.',
  etias_requirements    = 'Não aplicável — cidadãos da UE estão isentos de ETIAS.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para cidadãos portugueses que viajam para a Suécia.'
WHERE iso_code = 'SE';

-- Singapura (SG)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram em Singapura sem visto para estadias turísticas até 30 dias, extensíveis até 90 dias total mediante pedido às autoridades de imigração locais.',
  passport_requirements = 'Passaporte português válido com no mínimo 6 meses de validade além da data de saída. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável — Singapura não exige ETIAS. Entrada direta com passaporte.',
  vaccine_requirements  = 'Nenhuma vacina obrigatória para entrar em Singapura. Recomenda-se vacina contra hepatite A e atualização das vacinas de rotina.'
WHERE iso_code = 'SG';

-- África do Sul (ZA)
UPDATE public.countries SET
  visa_requirements     = 'Cidadãos portugueses entram na África do Sul sem visto para estadias turísticas até 90 dias. Autorização concedida na chegada sem necessidade de pedido prévio.',
  passport_requirements = 'Passaporte português válido com no mínimo 30 dias de validade além da data de saída pretendida e pelo menos 2 páginas em branco disponíveis para carimbo. Cartão de Cidadão não é aceite.',
  etias_requirements    = 'Não aplicável — a África do Sul não exige ETIAS. Entrada direta com passaporte.',
  vaccine_requirements  = 'Vacina contra febre amarela obrigatória se chegar de país endémico (ex: Brasil, Uganda). Recomenda-se vacina contra hepatite A, febre tifoide e antimalárica para zonas de risco como Kruger ou KwaZulu-Natal.'
WHERE iso_code = 'ZA';
