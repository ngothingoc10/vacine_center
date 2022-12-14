const { AppointmentService } = require('../services');
const ErrorCreator = require('../utils/error_creator');
const appointmentService = new AppointmentService();
async function create(req, res, next) {
  try {
    const userId = req.user.id;
    await appointmentService.create(req.body, userId);
    return res.json({
      message: 'Appointment is created successfully'
    });
  } catch (error) {
    next(error);
  }
}

async function find(req, res, next) {
  try {
    if (req.user?.roles?.includes('staff') || req.user?.roles?.includes('admin')) {
      const schedules = await appointmentService.find(req.query);
      return res.json(schedules);
    } else {
      const schedules = await appointmentService.find(req.query, req.user.id);
      return res.json(schedules);
    }
  } catch (error) {
    next(error);
  }
}

async function findOne(req, res, next) {
  try {
    if (req.user?.roles?.includes('staff') || req.user?.roles?.includes('admin')) {
      const findOptions = {
        id: req.params.id
      };
      const schedule = await appointmentService.findOne(findOptions);
      return res.json({ schedule });
    } else {
      const findOptions = {
        userId: req.user.id,
        id: req.params.id
      };
      const schedule = await appointmentService.findOne(findOptions);
      return res.json({ schedule });
    }
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    await appointmentService.update(req.params.id, req.body);
    return res.json({ message: 'Updated.' });
  } catch (error) {
    next(error);
  }
}

async function deleteAppointment(req, res, next) {
  try {
    await appointmentService.deleteAppointment(req.params.id);
    return res.json({ message: 'Deleted.' });
  } catch (error) {
    next(error);
  }
}
async function deleteMulti(req, res, next) {
  try {
    await appointmentService.deleteMulti(req.body.ids);
    return res.json({ message: 'Deleted.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  find,
  findOne,
  update,
  deleteAppointment,
  deleteMulti
};
