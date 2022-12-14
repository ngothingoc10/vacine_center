const { Op } = require('sequelize');
const {
  AppointmentRepository,
  ScheduleRepository,
  PatientRepository,
  VaccineRepository
} = require('../repositories');
const ErrorCreator = require('../utils/error_creator');
const moment = require('moment');
const { Sequelize } = require('../models');

module.exports = class AppointmentService {
  constructor() {
    this.repository = new AppointmentRepository();
    this.scheduleRepository = new ScheduleRepository();
    this.patientRepo = new PatientRepository();
    this.vaccineRepo = new VaccineRepository();
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
    const appointment = await this.repository.findOne(id);
    const updateData = {
      ...body
    };
    if (body.isCheckIn) {
      updateData.checkInAt = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    if (body.isCancelled) {
      await this.scheduleRepository.update(appointment.scheduleId, {
        totalParticipant: Sequelize.literal(`total_participant + 1`)
      });
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
    findOptions.include = ['schedule', 'user', 'patient', 'screeningTest', 'injections'];

    if (reqQuery.isConfirmed) {
      if (reqQuery.isConfirmed == 'true') {
        findOptions.where.isConfirmed = true;
      }
      if (reqQuery.isConfirmed == 'false') {
        findOptions.where.isConfirmed = false;
      }
      if (reqQuery.isConfirmed == 'null') {
        findOptions.where.isConfirmed = {
          [Op.is]: null
        };
      }
    }
    if (reqQuery.isCancelled) {
      if (reqQuery.isCancelled == 'true') {
        findOptions.where.isCancelled = true;
      }
      if (reqQuery.isCancelled == 'false') {
        findOptions.where.isCancelled = false;
      }
      if (reqQuery.isCancelled == 'trueOrFalseConfirm') {
        findOptions.where[Op.or] = [
          {
            isCancelled: true
          },
          {
            isConfirmed: false
          }
        ];
      }
    }

    const appointments = await this.repository.find(findOptions);
    const injections = appointments.rows.map((item) => item.injections);
    const vaccines = await Promise.all(
      injections.map(async (item) => {
        return await this.vaccineRepo.model.findAll({
          where: {
            id: item.map((i) => i.vaccineId)
          }
        });
      })
    );
    appointments.rows.forEach((element, index) => {
      element.setDataValue('vaccines', vaccines[index]);
    });
    return appointments;
  }
  async findOne(conditions) {
    const appointment = await this.repository.model.findOne({
      where: conditions,
      include: ['schedule', 'user', 'patient', 'screeningTest', 'injections']
    });
    if (!appointment) throw new ErrorCreator('Appointment not found', 404);
    const vaccines = await this.vaccineRepo.model.findAll({
      where: {
        id: appointment.injections.map((item) => item.vaccineId)
      }
    });
    appointment.setDataValue('vaccines', vaccines);
    return appointment;
  }

  async deleteAppointment(id) {
    return await this.repository.delete(id);
  }

  async deleteMulti(ids) {
    return await this.repository.deleteMulti(ids);
  }
};
