const { ScheduleConfigService } = require('../services');
const ErrorCreator = require('../utils/error_creator');
const scheduleConfigService = new ScheduleConfigService();
async function create(req, res, next) {
  try {
    await scheduleConfigService.create(req.body);
    return res.json({
      message: 'Schedule config is created successfully'
    });
  } catch (error) {
    next(error);
  }
}

async function findOne(req, res, next) {
  try {
    const scheduleConfig = await scheduleConfigService.find();
    return res.json({ scheduleConfig });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    await scheduleConfigService.update(req.params.id, req.body);
    return res.json({ message: 'Updated.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  findOne,
  update
};
