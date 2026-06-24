-- Entry requirements and visa data for Portuguese passport holders
-- Table: public.countries
-- Columns: visa_requirements, passport_requirements, etias_requirements, vaccine_requirements

-- Portugal (PT)
UPDATE public.countries SET
  visa_requirements     = 'Not applicable — Portugal is the destination. Portuguese citizens live and travel freely within the country.',
  passport_requirements = 'Not applicable.',
  etias_requirements    = 'Not applicable — EU citizens are exempt from ETIAS.',
  vaccine_requirements  = 'No mandatory vaccinations for residents of Portugal.'
WHERE iso_code = 'PT';

-- Brazil (BR)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens (EU) can enter Brazil visa-free for tourism stays of up to 90 days, extendable by a further 90 days (maximum 180 days per year).',
  passport_requirements = 'Valid Portuguese passport for the duration of the stay. A minimum validity of 6 months beyond the return date is recommended.',
  etias_requirements    = 'Not applicable — Brazil does not require ETIAS. Direct entry with a passport.',
  vaccine_requirements  = 'Yellow fever vaccination is mandatory when visiting the Amazon, Pantanal or central-western states. Typhoid fever and hepatitis A vaccines are also recommended.'
WHERE iso_code = 'BR';

-- Ukraine (UA)
UPDATE public.countries SET
  visa_requirements     = 'Not recommended — armed conflict is ongoing. Under normal circumstances, Portuguese citizens (EU) could enter visa-free for up to 90 days. Consult your foreign ministry before any travel.',
  passport_requirements = 'Valid Portuguese passport. Under normal circumstances, a minimum validity of 3 months beyond the planned departure date is required.',
  etias_requirements    = 'Not applicable — Ukraine is not part of the Schengen Area and does not require ETIAS.',
  vaccine_requirements  = 'No mandatory vaccinations. Keeping routine vaccines up to date (tetanus, hepatitis A) is recommended.'
WHERE iso_code = 'UA';

-- France (FR)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens enjoy full freedom of movement within the EU. Entry to France requires no visa — a national ID card or passport is sufficient, with no time limit.',
  passport_requirements = 'A valid Portuguese national ID card is sufficient to enter and remain in France. Passport optional.',
  etias_requirements    = 'Not applicable — EU citizens are exempt from ETIAS.',
  vaccine_requirements  = 'No mandatory vaccinations for Portuguese citizens travelling to France.'
WHERE iso_code = 'FR';

-- Spain (ES)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens enjoy full freedom of movement within the EU. Entry to Spain requires no visa — a national ID card or passport is sufficient, with no time limit.',
  passport_requirements = 'A valid Portuguese national ID card is sufficient. Spain and Portugal share the Schengen Area — no border controls exist.',
  etias_requirements    = 'Not applicable — EU citizens are exempt from ETIAS.',
  vaccine_requirements  = 'No mandatory vaccinations for Portuguese citizens travelling to Spain.'
WHERE iso_code = 'ES';

-- United States (US)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter the US without a visa under the Visa Waiver Program (VWP) for tourism or business stays of up to 90 days. An ESTA (Electronic System for Travel Authorization) must be obtained before boarding. Cost: USD 21.',
  passport_requirements = 'Valid Portuguese e-Passport required. A minimum validity of 6 months beyond the return date is recommended. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable in the US. Instead, the ESTA (Electronic System for Travel Authorization) is mandatory — valid for 2 years or until passport expiry. Cost: USD 21.',
  vaccine_requirements  = 'No mandatory vaccinations to enter the US. Travel health insurance is strongly recommended due to the high cost of medical care.'
WHERE iso_code = 'US';

-- Japan (JP)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter Japan without a visa for tourist stays of up to 90 days. No prior online registration is required — simply present your passport on arrival.',
  passport_requirements = 'Valid Portuguese passport for the duration of the stay. A minimum validity of 6 months beyond the return date is recommended. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable in Japan. Direct entry with a passport — no prior electronic authorisation required.',
  vaccine_requirements  = 'No mandatory vaccinations to enter Japan. Keeping routine vaccines up to date is recommended.'
WHERE iso_code = 'JP';

-- United Kingdom (GB)
UPDATE public.countries SET
  visa_requirements     = 'Since Brexit, Portuguese citizens (EU) no longer have automatic residency rights in the UK. For tourism up to 6 months, no visa is required, but an ETA (Electronic Travel Authorisation) must be obtained before boarding. Cost: £10.',
  passport_requirements = 'A valid Portuguese passport is mandatory. National ID cards have not been accepted in the UK since Brexit. A minimum validity of 6 months is recommended.',
  etias_requirements    = 'Not applicable. Instead of ETIAS, the UK requires its own ETA (Electronic Travel Authorisation), applied for before travel via the official UK government website.',
  vaccine_requirements  = 'No mandatory vaccinations for Portuguese citizens travelling to the United Kingdom.'
WHERE iso_code = 'GB';

-- Italy (IT)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens enjoy full freedom of movement within the EU. Entry to Italy requires no visa — a national ID card or passport is sufficient, with no time limit.',
  passport_requirements = 'A valid Portuguese national ID card is sufficient. Italy and Portugal share the Schengen Area — no border controls exist.',
  etias_requirements    = 'Not applicable — EU citizens are exempt from ETIAS.',
  vaccine_requirements  = 'No mandatory vaccinations for Portuguese citizens travelling to Italy.'
WHERE iso_code = 'IT';

-- United Arab Emirates (AE)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter the UAE without a visa for tourist stays of up to 90 days. A visa is granted free of charge and automatically on arrival (Visa on Arrival).',
  passport_requirements = 'Valid Portuguese passport with at least 6 months of validity beyond the departure date. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable — the UAE does not require ETIAS. Direct entry with a passport.',
  vaccine_requirements  = 'No mandatory vaccinations. Hepatitis A vaccine and up-to-date routine vaccinations are recommended.'
WHERE iso_code = 'AE';

-- Australia (AU)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens require a visa to enter Australia. The simplest option for tourism is the ETA (Electronic Travel Authority, subclass 601) — fully online, free of charge, valid for 12 months with stays of up to 3 months at a time.',
  passport_requirements = 'Valid Portuguese e-Passport required. A minimum validity of 6 months beyond the return date is recommended. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable in Australia. Instead, the ETA (Electronic Travel Authority) or eVisitor (subclass 651) is required — both are free and processed online.',
  vaccine_requirements  = 'No mandatory vaccinations to enter Australia, except yellow fever if arriving from an endemic country. Hepatitis A and B vaccines are recommended.'
WHERE iso_code = 'AU';

-- Chile (CL)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter Chile without a visa for tourist stays of up to 90 days, extendable by a further 90 days via the Chilean Immigration Department.',
  passport_requirements = 'Valid Portuguese passport with at least 6 months of validity beyond the departure date. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable — Chile does not require ETIAS. Direct entry with a passport.',
  vaccine_requirements  = 'No mandatory vaccinations. Typhoid fever and hepatitis A vaccines are recommended for travellers visiting rural areas.'
WHERE iso_code = 'CL';

-- Egypt (EG)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens require a visa to enter Egypt. It can be obtained online (e-Visa) before travel or as a Visa on Arrival at the airport. Approximate cost: USD 25. Valid for 30 days.',
  passport_requirements = 'Valid Portuguese passport with at least 6 months of validity beyond the departure date. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable — Egypt does not require ETIAS. Instead, the Egyptian e-Visa or Visa on Arrival is required.',
  vaccine_requirements  = 'No strictly mandatory vaccinations for tourists. Hepatitis A, typhoid fever and updated tetanus vaccines are recommended. Yellow fever vaccination is required if arriving from an endemic country.'
WHERE iso_code = 'EG';

-- Israel (IL)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter Israel without a visa for tourist stays of up to 90 days. Authorisation is granted on arrival by the border officer — no prior application is needed.',
  passport_requirements = 'Valid Portuguese passport with at least 6 months of validity beyond the departure date. National ID cards are not accepted. Note: prior travel stamps from certain Arab countries may trigger additional questioning at the border.',
  etias_requirements    = 'Not applicable — Israel does not require ETIAS. Direct entry with a passport.',
  vaccine_requirements  = 'No mandatory vaccinations to enter Israel. Keeping routine vaccines up to date is recommended.'
WHERE iso_code = 'IL';

-- Iceland (IS)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter Iceland without a visa. Iceland is part of the Schengen Area (despite not being an EU member), so freedom of movement applies in full.',
  passport_requirements = 'A valid Portuguese national ID card is sufficient to enter and travel in Iceland. Passport optional.',
  etias_requirements    = 'Not applicable — EU citizens are exempt from ETIAS. Iceland applies the same Schengen rules.',
  vaccine_requirements  = 'No mandatory vaccinations for Portuguese citizens travelling to Iceland.'
WHERE iso_code = 'IS';

-- Morocco (MA)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter Morocco without a visa for stays of up to 90 days. Simply present your passport on arrival.',
  passport_requirements = 'Valid Portuguese passport with at least 6 months of validity beyond the departure date. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable — Morocco does not require ETIAS. Direct entry with a passport.',
  vaccine_requirements  = 'No strictly mandatory vaccinations. Hepatitis A, typhoid fever and updated tetanus vaccines are recommended for travel to the interior or rural areas.'
WHERE iso_code = 'MA';

-- New Zealand (NZ)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens require an NZeTA (New Zealand Electronic Travel Authority) before boarding a flight to New Zealand. The application is made online or via the official app. Cost: NZD 23. Valid for 2 years with stays of up to 90 days at a time.',
  passport_requirements = 'Valid Portuguese e-Passport required. A minimum validity of 6 months beyond the return date is recommended. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable in New Zealand. Instead, the NZeTA (New Zealand Electronic Travel Authority) is mandatory, applied for online before travel.',
  vaccine_requirements  = 'No mandatory vaccinations to enter New Zealand, except yellow fever if arriving from an endemic country. Hepatitis A and B vaccines are recommended.'
WHERE iso_code = 'NZ';

-- Sweden (SE)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens enjoy full freedom of movement within the EU. Entry to Sweden requires no visa — a national ID card or passport is sufficient, with no time limit.',
  passport_requirements = 'A valid Portuguese national ID card is sufficient. Sweden and Portugal share the Schengen Area — no border controls exist.',
  etias_requirements    = 'Not applicable — EU citizens are exempt from ETIAS.',
  vaccine_requirements  = 'No mandatory vaccinations for Portuguese citizens travelling to Sweden.'
WHERE iso_code = 'SE';

-- Singapore (SG)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter Singapore without a visa for tourist stays of up to 30 days, extendable up to a total of 90 days upon request to the local immigration authorities.',
  passport_requirements = 'Valid Portuguese passport with at least 6 months of validity beyond the departure date. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable — Singapore does not require ETIAS. Direct entry with a passport.',
  vaccine_requirements  = 'No mandatory vaccinations to enter Singapore. Hepatitis A vaccine and up-to-date routine vaccinations are recommended.'
WHERE iso_code = 'SG';

-- South Africa (ZA)
UPDATE public.countries SET
  visa_requirements     = 'Portuguese citizens can enter South Africa without a visa for tourist stays of up to 90 days. Authorisation is granted on arrival — no prior application is needed.',
  passport_requirements = 'Valid Portuguese passport with at least 30 days of validity beyond the intended departure date and a minimum of 2 blank pages available for stamping. National ID cards are not accepted.',
  etias_requirements    = 'Not applicable — South Africa does not require ETIAS. Direct entry with a passport.',
  vaccine_requirements  = 'Yellow fever vaccination is mandatory if arriving from an endemic country (e.g. Brazil, Uganda). Hepatitis A, typhoid fever and anti-malarial medication are recommended for risk areas such as Kruger or KwaZulu-Natal.'
WHERE iso_code = 'ZA';
