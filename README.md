# Instauto - Plataforma de Conexão entre Motoristas e Oficinas

O Instauto é uma solução SaaS completa projetada para conectar motoristas a oficinas mecânicas, enquanto oferece um sistema ERP + CRM integrado para gestão eficiente de oficinas automotivas.

## 🚀 Visão Geral

A plataforma resolve dois problemas principais:

### Para Motoristas:
- Encontrar oficinas confiáveis e próximas
- Solicitar orçamentos para serviços automotivos
- Acompanhar o status de reparos em tempo real
- Receber lembretes de manutenção preventiva
- Manter um histórico completo de manutenção do veículo

### Para Oficinas Mecânicas:
- Sistema completo de ERP + CRM
- Gestão de ordens de serviço
- Controle de estoque e peças
- Gestão financeira
- Agendamento de serviços
- Diagnóstico com IA para problemas mecânicos
- Aumento de visibilidade e captação de novos clientes

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14 com App Router, React, TypeScript
- **Estilização**: Tailwind CSS, Framer Motion para animações
- **Componentes**: Material UI, Heroicons
- **Funcionalidades**: IA para diagnósticos, integração com WhatsApp

## 📱 Principais Funcionalidades

### Lado do Motorista
- Busca de oficinas por localização e tipo de serviço
- Solicitação de orçamentos
- Agendamento de serviços
- Avaliação de serviços
- Histórico de manutenção

### Lado da Oficina
- Dashboard gerencial
- Gestão de clientes
- Ordens de serviço digitais
- Controle de estoque
- Gestão financeira
- Diagnóstico assistido por IA
- Relatórios de desempenho

## 🔄 Fluxo de Trabalho

1. Motorista busca serviço na plataforma
2. Oficinas próximas recebem a solicitação
3. Oficinas enviam orçamentos pelo sistema
4. Motorista escolhe a melhor proposta
5. Oficina realiza o serviço atualizando o status
6. Cliente recebe notificações de progresso
7. Após conclusão, cliente avalia o serviço

## 💻 Como Executar Localmente

### Pré-requisitos
- Node.js 18.0 ou superior
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/eubbbruno/instauto-v9.git

# Entre no diretório
cd instauto-v9

# Instale as dependências
npm install
# ou
yarn

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📊 Estrutura de Diretórios

```
instauto-v9/
├── public/          # Arquivos estáticos (imagens, ícones)
├── src/             # Código fonte
│   ├── app/         # Páginas e rotas (App Router)
│   │   ├── dashboard/     # Área do sistema para oficinas
│   │   ├── oficinas/      # Landing page para oficinas
│   │   └── page.tsx       # Página inicial (motoristas)
│   ├── components/  # Componentes reutilizáveis
│   └── styles/      # Estilos globais e temas
└── package.json     # Dependências e scripts
```

## 🚧 Status do Projeto

O projeto está em desenvolvimento ativo. Próximos passos:

- [ ] Implementação do backend e banco de dados
- [ ] Autenticação e autorização
- [ ] Sistema de pagamento e faturamento
- [ ] Aplicativo móvel para motoristas
- [ ] API para integração com sistemas de terceiros

## 📜 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Desenvolvido com 💙 pela equipe Instauto
