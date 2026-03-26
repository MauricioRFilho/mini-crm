# Mini CRM de Atendimento (Instruções Originais) 🚀

Sistema completo para gestão de pacientes e fluxos de atendimento, focado em simplicidade e robustez técnica.

## 🏗️ Arquitetura e Decisões (ADRs)

- **Monorepo:** Organização clara entre `backend/` e `frontend/`.
- **Backend:** Express + TypeScript + Prisma ORM (PostgreSQL).
- **Status Flow:** Máquina de estado rigorosa: `AGUARDANDO` ➔ `EM_ATENDIMENTO` ➔ `FINALIZADO`.
- **Frontend:** React + Vite + Vanilla CSS (Design Premium/Dark Mode).
- **Containerização:** Docker Compose orquestrando Banco, API e Web.

## 🛠️ Tecnologias

- **Backend:** Node.js, Express, Prisma, Zod, Vitest (Integração).
- **Frontend:** React, Axios, Lucide React (Icons), Google Fonts (Inter).
- **Infra:** Docker, PostgreSQL.

## 🚀 Como Executar

### Pré-requisitos
- Docker & Docker Compose instalado.

### Passo a Passo
1. Clone o repositório.
2. Na raiz, execute:
   ```bash
   docker compose up --build
   ```
3. O sistema estará disponível em:
   - **Frontend:** `http://localhost:5173`
   - **Backend API:** `http://localhost:3001`

## 🧪 Testes

Os testes de integração cobrem o ciclo de vida dos pacientes e as restrições de fluxo de status:
```bash
cd backend
npm test
```

## 📐 Regras de Negócio Implementadas

1. **Pacientes:** CRUD completo com validação de campos obrigatórios via Zod.
2. **Atendimentos:** 
   - Criação vinculada a um paciente existente.
   - Status inicial padrão: `AGUARDANDO`.
   - Transição linear de status via endpoint `PATCH`.
   - Bloqueio de retrocesso ou avanço inválido (máquina de estados).
   - Deleção física permitida.

---
Projeto desenvolvido seguindo o protocolo **Antigravity Kit**.
