const { Op } = require('sequelize');
const { AppointmentRepository, ScheduleRepository, PatientRepository } = require('../repositories');
const ErrorCreator = require('../utils/error_creator');
const moment = require('moment');

module.exports = class AppointmentService {
  constructor() {
    this.repository = new AppointmentRepository();
    this.scheduleRepository = new ScheduleRepository();
    this.patientRepo = new PatientRepository();
  }
  async create(data, userId) {
    const createData = {
      ...data,
      wishList: data.wishList
    };
    let patient;
    if (data.patientCode) {
      patient = await this.patientRepo.model.findOne({
        where: {
          patientCode: data.patientCode
        }
      });
      if (!patient) throw new ErrorCreator('Patient Code is invalid', 404);
    } else {
      const patientData = {
        patientName: data.patientName,
        representative: userId,
        birthday: data.birthday,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        province: data.province,
        district: data.district,
        ward: data.ward,
        street: data.street
      };
      patient = await this.patientRepo.model.create(patientData);
    }
    createData.userId = userId;
    createData.patientId = patient.id;
    await this.repository.create(createData);
    const schedule = await this.scheduleRepository.findOne(data.scheduleId);
    schedule.registerParticipantNumber += 1;
    if (schedule.registerParticipantNumber > schedule.total_participant) {
      throw new ErrorCreator('Schedule is full', 400);
    }
    await schedule.save();
    return;
  }

  async update(id, body) {
    const updateData = {
      ...body
    };
    if (body.isCheckIn) {
      updateData.checkInAt = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      updateData.checkInAt = null;
    }
    await this.repository.update(id, updateData);
    return;
  }

  async find(reqQuery, userId) {
    const findOptions = {
      where: {}
    };
    if (reqQuery.page) {
      findOptions.limit = +reqQuery.perPage || 10;
      findOptions.offset = (+reqQuery.page - 1) * findOptions.limit;
    }

    if (reqQuery.orderBy) {
      findOptions.order = [reqQuery.orderBy, reqQuery.orderType || 'DESC'];
    }

    if (reqQuery.scheduleId) {
      findOptions.where.scheduleId = reqQuery.scheduleId;
    }
    if (reqQuery.listType) {
      findOptions.where.listType = reqQuery.listType;
    }
    if (reqQuery.desiredDate) {
      findOptions.where.desiredDate = reqQuery.desiredDate;
    }
    if (reqQuery.patientId) {
      findOptions.where.patientId = reqQuery.patientId;
    }
    if (reqQuery.isCheckIn) {
      findOptions.where['$check_in_at$'] = { [Op.not]: null };
    }
    if (reqQuery.patientCode) {
      findOptions.where['$patient.patient_code$'] = reqQuery.patientCode;
    }
    if (reqQuery.patientName) {
      findOptions.where['$patient.patient_name$'] = {
        [Op.like]: `%${reqQuery.patientName}%`
      };
    }
    if (userId) {
      findOptions.where.userId = userId;
    }
    findOptions.include = ['schedule', 'user', 'patient', 'screeningTest'];

    if (reqQuery.isConfirmed) {
      findOptions.where.isConfirmed = reqQuery.isConfirmed;
    }

    return await this.repository.find(findOptions);
  }

  async findOne(id) {
    return await this.repository.findOne(id, [
      'schedule',
      'user',
      'patient',
      'screeningTest'
    ]);
  }

  async deleteAppointment(id) {
    return await this.repository.delete(id);
  }

  async deleteMulti(ids) {
    return await this.repository.deleteMulti(ids);
  }
};
