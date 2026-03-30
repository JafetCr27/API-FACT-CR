# API-FACT-CR

🧱 🏗️ 1. Stack del proyecto

Node.js
Express.js
PostgreSQL
ORM: Prisma
Firma XML
Integración Hacienda

Roadmap recomendado (paso a paso)


Fase 1 (MVP)


Endpoint factura
 XML básico
 Firma
 Envío sandbox
Fase 2
 Multiempresa
 Base de datos
 API keys
Fase 3
 Notas crédito/débito
 Consulta estado
 Reintentos
Fase 4 (PRO)
 Colas
 Logs
 Dashboard

Estructura

src/
│
|-- app.js
├── server.js
│
├── config/
│   └── db.js
│
├── modules/
│   ├── company/
│   │   ├── company.controller.js
│   │   ├── company.service.js
│   │   ├── company.routes.js
│   │
│   ├── document/
│   │   ├── document.controller.js
│   │   ├── document.service.js
│   │   ├── document.routes.js
│
├── services/
│   ├── xml.service.js
│   ├── sign.service.js
│   ├── hacienda.service.js
│
├── middlewares/
│   └── apiKey.middleware.js
│
└── utils/
    └── clave.js
