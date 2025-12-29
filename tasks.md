# Tasks - Ideas Marketplace

## 🏠 Core - Páginas Principais
- [ ] Página principal com feed de ideias (listagem, ordenação por upvotes/recentes)
- [ ] Página de detalhes da ideia (descrição completa, autor, data)
- [ ] Página de explorar/descobrir ideias com filtros
- [ ] Página "Minhas Ideias" (ideias que o usuário postou)

## 📝 Ideias - CRUD
- [ ] Formulário para criar nova ideia (título, descrição, categoria)
- [ ] API para criar ideia
- [ ] API para listar ideias (com paginação)
- [ ] API para buscar ideia por ID
- [ ] Funcionalidade de editar ideia própria
- [ ] Funcionalidade de deletar ideia própria
- [ ] Sistema de categorias/tags para ideias

## 👤 Perfil de Usuário
- [ ] Página de perfil público (ideias postadas, upvotes recebidos, créditos)
- [ ] Página de editar perfil (avatar, bio, links sociais)
- [ ] API para atualizar perfil

## ⬆️ Sistema de Upvotes
- [ ] Botão de upvote em cada ideia (toggle)
- [ ] API para dar/remover upvote
- [ ] Prevenir upvote na própria ideia
- [ ] Contagem de upvotes com optimistic updates
- [ ] Lista de "Ideias que dei upvote"

## 💰 Sistema de Créditos
- [ ] Lógica: 1 upvote recebido = 1 crédito
- [ ] Dashboard de créditos (saldo atual)
- [ ] Histórico de transações (ganhos e gastos)
- [ ] API para consultar saldo
- [ ] API para registrar transações

## 📢 Sistema de Anúncios
- [ ] Formulário para criar anúncio de SaaS (título, descrição, link, imagem)
- [ ] Definir custo em créditos por anúncio
- [ ] API para criar anúncio
- [ ] Exibição de anúncios no feed (slots patrocinados)
- [ ] Dashboard de anúncios do usuário (status, métricas)
- [ ] Métricas básicas (impressões, cliques)

## 💬 Interação Social
- [ ] Sistema de comentários nas ideias
- [ ] API para CRUD de comentários
- [ ] Notificações (upvote recebido, comentário na ideia)
- [ ] Página de notificações
- [ ] Compartilhar ideia (copiar link, redes sociais)

## 🔍 Busca e Filtros
- [ ] Barra de busca por título/descrição
- [ ] Filtro por categoria
- [ ] Filtro por período (hoje, semana, mês, todos)
- [ ] Ordenação (mais votados, recentes, trending)

## 🏆 Gamificação (Firulas)
- [ ] Ranking de usuários com mais créditos
- [ ] Ranking de ideias mais votadas (hall da fama)
- [ ] Badges/conquistas (primeira ideia, 10 upvotes, etc.)
- [ ] Streak de postagem diária
- [ ] Nível do usuário baseado em atividade

## 🎨 UI/UX Polish
- [ ] Loading states e skeletons
- [ ] Animações de upvote (confetti, bounce)
- [ ] Toast notifications
- [ ] Empty states ilustrados
- [ ] Modo escuro/claro
- [ ] Responsividade mobile

## 🔒 Segurança e Validação
- [ ] Rate limiting nas APIs
- [ ] Validação de inputs (Zod)
- [ ] Proteção contra spam de ideias
- [ ] Moderação de conteúdo (reportar ideia)

## 📊 Analytics (Firulas Avançadas)
- [ ] Dashboard admin com estatísticas gerais
- [ ] Gráficos de crescimento (ideias, usuários, upvotes)
- [ ] Ideias trending da semana (email digest)
