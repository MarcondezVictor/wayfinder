# Wayfinder

Plataforma de planeamento de viagens que agrega, num só lugar, informação sobre vistos, custos, segurança e clima para países de todo o mundo. Desenvolvida como projeto integrado do Instituto Politécnico de Tomar.

---

## Funcionalidades

- **Mapa interativo** — explorar países diretamente no mapa mundial (amCharts 5)
- **Pesquisa inteligente** — pesquisar por nome ou continente com resultados em tempo real
- **Página de país** — visão geral, entrada & vistos, segurança, custos, clima, métricas de qualidade de vida, atrações e cidades principais
- **Calculadora de viagem** — estimativa de custo total por número de dias
- **Comparar países** — confrontar dois destinos lado a lado com sistema de pontuação ponderada e sliders de prioridade
- **Dashboard pessoal** — lista de destinos guardados com estatísticas (continente mais frequente, país mais barato)
- **Autenticação** — registo e login com Supabase Auth


---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS v4 |
| Ícones | Lucide React |
| Mapa | amCharts 5 + amCharts Geodata |
| Base de dados & Auth | Supabase (PostgreSQL + Row Level Security) |
| Linguagem | TypeScript 5 |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # Página inicial (mapa + grid de países)
│   ├── country/[slug]/       # Página de detalhe por país
│   ├── compare/              # Ferramenta de comparação
│   ├── dashboard/            # Painel pessoal do utilizador
│   ├── login/                # Autenticação
│   └── register/             # Registo de conta
├── components/
│   ├── AuthProvider.tsx      # Contexto de autenticação global
│   ├── CountriesGrid.tsx     # Grid de países com filtro por continente
│   ├── FavoriteButton.tsx    # Botão guardar/remover favorito
│   ├── InteractiveMap.tsx    # Mapa amCharts
│   ├── Navbar.tsx            # Navegação principal
│   └── Searchbar.tsx         # Pesquisa com dropdown
└── lib/
    ├── db-countries.ts       # Queries Supabase com fallback local
    ├── countries-data.ts     # Dataset local de fallback
    └── supabase.ts           # Cliente Supabase
public/
├── covers/                   # Fotos de capa por país (ISO-2.jpg, ex: pt.jpg)
├── attractions/              # Fotos de atrações (ISO-2-N.jpg, ex: pt-1.jpg)
└── flags/                    # Bandeiras SVG por código ISO-2
```

---

## Configuração local

### Pré-requisitos

- Node.js 18+
- Conta Supabase (gratuita)

### Variáveis de ambiente

Criar um ficheiro `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### Instalar e correr

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no browser.

### Build de produção

```bash
npm run build
npm start
```

---

## Base de dados (Supabase)

As principais tabelas são:

| Tabela | Descrição |
|---|---|
| `countries` | Dados de todos os países (vistos, custos, clima, atrações, etc.) |
| `profiles` | Perfil público do utilizador (nome, nacionalidade) |
| `user_preferences` | Estilo de viagem preferido |
| `favorites` | Relação utilizador ↔ país guardado |

Row Level Security está ativado — cada utilizador só acede aos seus próprios dados nas tabelas `profiles`, `user_preferences` e `favorites`.

---

## Imagens

As imagens são servidas localmente a partir de `/public`:

- **Covers** — `/covers/<iso2>.jpg` (ex: `/covers/pt.jpg`) — foto de capa do país
- **Atrações** — `/attractions/<iso2>-<n>.jpg` (ex: `/attractions/pt-1.jpg`) — foto de cada atração (índice a partir de 1)
- **Bandeiras** — `/flags/<iso2>.svg` (ex: `/flags/pt.svg`)

Se uma imagem local não existir, o componente usa o `image_url` guardado na base de dados como fallback.

---

## Autores

Projeto desenvolvido no âmbito da unidade curricular de Projeto Integrado 1 do curso de Engenharia Informática — Instituto Politécnico de Tomar.
