const ErrorCreator = require('./error_creator');

module.exports = class BaseRepository {
  constructor() {
    this.model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async find(findOptions) {
    console.log(findOptions);
    findOptions.order = findOptions.order
      ? [['updatedAt', 'DESC'], findOptions.order]
      : [['updatedAt', 'DESC']];
    findOptions.distinct = true;
    return this.model.findAndCountAll(findOptions);
  }

  async findOne(id, relation = []) {
    console.log(id);
    return this.model.findByPk(id, { include: relation });
  }

  async update(id, data) {
    const instance = await this.model.findByPk(id);
    if (!instance) throw new ErrorCreator('Not Found', 404);
    Object.assign(instance, data);
    return await instance.save();
  }

  async delete(id) {
    const instance = await this.model.findByPk(id);
    if (!instance) throw new ErrorCreator('Not Found', 404);
    return await instance.destroy();
  }

  async deleteMulti(ids) {
    return await this.model.destroy({
      where: {
        id: ids
      }
    });
  }
};
