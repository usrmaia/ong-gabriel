// tudo que for inscrito nesse arquivo é o que ficará na Rotate3D, não é necessário usar "use client"
// no lugar de usar botão, usar o link do next
// e verificar as outras telas 


// Como administrador
// Quero acessar uma tela de listagem de usuários com a role PREPSYCHO
// Para visualizar e gerenciar facilmente os voluntários a psicólogos
// 📋 Descrição:
// Criar a tela /admin/pre-psych/list que exibe todos os usuários com role PREPSYCHO.
// A tela deve ter:
// Um BackNavigationHeader com título "Novos Cadastros de Psicólogo" que redireciona para /employee/home.
// Ao selecionar um usuário, ser redirecionado para /admin/pre-psych/details/prepsychoId.
// Um novo layout.tsx exclusivo para /admin, garantindo que apenas ADMIN tenha acesso às rotas desse escopo (seguir padrão já existente em /employee).