const { v4: uuidv4 } = require("uuid");

// Repositório fake em memória com o usuário admin pré-cadastrado
const users = [
    {
        id: uuidv4(),
        name: "admin",
        email: "admin@spsgroup.com.br",
        type: "admin",
        password: "1234",
    },
];

function findAll() {
    return users;
}

function findById(id) {
    return users.find((u) => u.id === id) || null;
}

function findByEmail(email) {
    return users.find((u) => u.email === email) || null;
}

function create({ name, email, type, password }) {
    const newUser = { id: uuidv4(), name, email, type, password };
    users.push(newUser);
    return newUser;
}

function update(id, data) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    return users[index];
}

function remove(id) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, findByEmail, create, update, remove };
