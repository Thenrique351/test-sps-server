const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const user = userRepository.findByEmail(email);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, type: user.type },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, type: user.type },
    });
}

module.exports = { login };
