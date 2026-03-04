const userRepository = require("../repositories/userRepository");

// Lista todos os usuários (sem o campo password)
function listUsers(req, res) {
    const users = userRepository.findAll().map(({ password, ...rest }) => rest);
    return res.json(users);
}

// Busca um usuário por ID
function getUser(req, res) {
    const { id } = req.params;
    const user = userRepository.findById(id);
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const { password, ...rest } = user;
    return res.json(rest);
}

// Cria um novo usuário (apenas admin)
async function createUser(req, res) {
    const { name, email, type, password } = req.body;

    // Verificar se é admin
    if (req.user.type !== "admin") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem criar usuários." });
    }

    if (!name || !email || !type || !password) {
        return res.status(400).json({ error: "Campos obrigatórios: name, email, type, password." });
    }

    const existing = userRepository.findByEmail(email);
    if (existing) {
        return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    const newUser = userRepository.create({ name, email, type, password });
    const { password: _, ...rest } = newUser;
    return res.status(201).json(rest);
}

// Atualiza dados de um usuário (admin pode editar qualquer um, user apenas o próprio)
async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email, type, password } = req.body;
    const currentUserId = req.user.id;
    const currentUserType = req.user.type;

    const existing = userRepository.findById(id);
    if (!existing) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar permissão: admin pode editar qualquer um, user apenas o próprio
    if (currentUserType !== "admin" && currentUserId !== id) {
        return res.status(403).json({ error: "Acesso negado. Você só pode editar seu próprio perfil." });
    }

    // Se não for admin, não pode alterar o type
    if (type && currentUserType !== "admin") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem alterar o tipo de usuário." });
    }

    // Se não for admin, não pode alterar a senha de outro usuário
    if (password && currentUserType !== "admin" && currentUserId !== id) {
        return res.status(403).json({ error: "Acesso negado." });
    }

    // Se tenta trocar o e-mail, verifica se já está em uso por outro usuário
    if (email && email !== existing.email) {
        const emailInUse = userRepository.findByEmail(email);
        if (emailInUse) {
            return res.status(409).json({ error: "E-mail já cadastrado por outro usuário." });
        }
    }

    const updated = userRepository.update(id, { name, email, type, password });
    const { password: _, ...rest } = updated;
    return res.json(rest);
}

// Remove um usuário (apenas admin, e admin não pode excluir a si mesmo)
async function deleteUser(req, res) {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // Verificar se é admin
    if (req.user.type !== "admin") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem excluir usuários." });
    }

    // Admin não pode excluir a si mesmo
    if (currentUserId === id) {
        return res.status(403).json({ error: "Você não pode excluir seu próprio usuário." });
    }

    const removed = userRepository.remove(id);
    if (!removed) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }
    return res.status(204).send();
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
