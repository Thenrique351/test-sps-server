# Test SPS Server

Backend REST API para sistema de gestão de usuários com autenticação JWT.

## 🚀 Pré-requisitos

- Node.js (versão 18+)
- npm ou yarn

## 📥 Instalação

```bash
# Instalar dependências
npm install

# ou com yarn
yarn install
```

## ⚙️ Configuração

O projeto funciona **sem necessidade de criar o .env** - valores padrão são fornecidos automaticamente:

| Variável | Padrão | Descrição |
|----------|--------|------------|
| PORT | 3001 | Porta do servidor |
| JWT_SECRET | spsgroup_default_secret_key | Chave para JWT |

⚠️ **Para produção**, recomenda-se criar seu próprio .env:

```bash
cp .env.example .env
```

## ▶️ Como Rodar

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em: `http://localhost:3001`

## 👤 Usuário Admin Padrão

O sistema cria automaticamente um usuário admin:

| Campo | Valor |
|-------|-------|
| Email | admin@spsgroup.com.br |
| Senha | 1234 |

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/auth/login` | Autentica usuário e retorna token JWT | Público |

### Usuários

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/users` | Lista todos os usuários | Autenticado |
| GET | `/users/:id` | Busca usuário por ID | Autenticado |
| POST | `/users` | Cria novo usuário | Admin |
| PUT | `/users/:id` | Atualiza usuário | Admin ou próprio usuário |
| DELETE | `/users/:id` | Remove usuário | Admin |

### Headers Necessários

Para rotas protegidas, envie o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

### Exemplos de Requisição

**Login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@spsgroup.com.br", "password": "1234"}'
```

**Listar usuários:**
```bash
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer <seu_token>"
```

## 🔐 Controle de Acesso

- **Admin**: pode criar, editar e excluir qualquer usuário (exceto a si mesmo)
- **User**: pode apenas visualizar usuários e editar seu próprio perfil

## 📁 Estrutura do Projeto

```
src/
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   └── userController.js    # CRUD de usuários
├── middlewares/
│   ├── auth.js              # Middleware de autenticação (não usado)
│   └── ensureAuthenticate.js # Verifica token JWT
├── repositories/
│   └── userRepository.js    # Repositório em memória
├── routes.js                # Definição das rotas
└── index.js                 # Entrada da aplicação
```

## 🔧 Decisões de Implementação

- **Repositório em memória**: Os dados são armazenados em memória (não persistem após reiniciar)
- **JWT**: Tokens com expiração de 1 dia
- **Senhas**: Armazenadas sem hash (em produção, usar bcrypt)
