const { User } = require('../models/sequelize');

async function getAll(req, res) {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  res.status(200).json(users);
}

async function getById(req, res) {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
}

async function create(req, res) {
  const { name, email } = req.body;
  const user = await User.create({ name, email });

  res.status(201).json(user);
}

async function update(req, res) {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await user.update(req.body, { fields: ['name', 'email'] });

  res.status(200).json(user);
}

async function remove(req, res) {
  const deleted = await User.destroy({ where: { id: req.params.id } });

  if (deleted === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(204).send();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
