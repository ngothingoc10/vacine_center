import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  Divider,
  DatePicker,
  Button,
  Tag,
  Card,
  Result
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertOutlined, CloseOutlined } from '@ant-design/icons';
import Container from '../../layout/Container';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { getProvinceList } from '../../actions/province.action';
import { getScheduleOnDay } from '../../actions/schedule.action';
import { getVaccineList } from '../../actions/vaccine.action';
import { editAppointment, getAppointment } from '../../actions/appointment.action';
import moment from 'moment';
import './index.css';

const { CheckableTag } = Tag;
const { Meta } = Card;
const UserUpdateAppointmentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [districts, setDistricts] = useState();
  const [wards, setWards] = useState();
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [changedVaccineId, setChangedVaccineId] = useState();
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  const wishListPrice = selectedVaccines?.reduce((total, crr) => total + crr.price, 0);
  const formRef = useRef();

  const provinceList = useSelector((state) => state.provinceList);
  const { provinces } = provinceList;

  const scheduleOnDay = useSelector((state) => state.scheduleOnDay);
  const { schedules } = scheduleOnDay;

  const appointment = useSelector((state) => state.appointment);
  const { appointmentItem, loading, error } = appointment;

  const vaccineList = useSelector((state) => state.vaccineList);
  const { vaccines } = vaccineList;

  const vaccineOptions = vaccines?.map((item) => ({
    label: item.name,
    value: item.id,
    key: item.id
  }));

  const appointmentEdit = useSelector((state) => state.appointmentEdit);
  const { editSuccess } = appointmentEdit;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let scheduleArr = schedules?.map((item) => ({
    ...item,
    startAt: moment(moment(item.startAt, 'HH:mm')).format('HH:mm'),
    endAt: moment(moment(item.startAt, 'HH:mm'))
      .add(item.appointmentDuration, 'minutes')
      .format('HH:mm')
  }));

  const provinceOptions = provinces?.map((item) => ({
    label: item.name,
    value: item.code
  }));

  const relativeOptions = [
    {
      value: 'B???n th??n',
      label: 'B???n th??n'
    },
    {
      value: 'Con',
      label: 'Con'
    },
    {
      value: 'Cha',
      label: 'Cha'
    },
    {
      value: 'M???',
      label: 'M???'
    },
    {
      value: 'V???',
      label: 'V???'
    },
    {
      value: 'Ch???ng',
      label: 'Ch???ng'
    },
    {
      value: 'Anh',
      label: 'Anh'
    },
    {
      value: 'Ch???',
      label: 'Ch???'
    },
    {
      value: 'Em',
      label: 'Em'
    },
    {
      value: 'H??? h??ng',
      label: 'H??? h??ng'
    }
  ];

  const handleChangeProvince = (code) => {
    formRef.current?.setFieldsValue({
      qh: null,
      px: null
    });
    const district = provinces.find((item) => item.code === code).districts;
    setDistricts(districts);
    setDistrictOptions(district?.map((item) => ({ label: item.name, value: item.code })));
  };

  const handleChangeDistrict = (code) => {
    const ward = districts?.find((item) => item.code === code).wards;
    setWards(wards);
    setWardOptions(ward?.map((item) => ({ label: item.name, value: item.code })));
  };

  const handleChangeDay = (date) => {
    const selectedDay = moment(date).format('YYYY-MM-DD');
    dispatch(getScheduleOnDay(selectedDay));
  };

  const onChangeVaccine = (value) => {
    setChangedVaccineId(value);
  };
  const onSearchVaccine = (value) => {
    console.log('search:', value);
  };

  const handleRemoveVaccine = (id) => {
    if (id) setSelectedVaccines(selectedVaccines.filter((item) => item.id != id));
  };

  const handleAddVaccine = () => {
    const vaccine = vaccines.find((item) => item.id == changedVaccineId);
    if (vaccine) setSelectedVaccines(selectedVaccines.concat(vaccine));
  };

  const [selectedTag, setSelectedTag] = useState();
  const handleChangeTag = (tag, checked) => {
    setSelectedTag(tag);
    formRef.current?.setFieldsValue({
      scheduleId: tag.id
    });
  };

  const onFinish = (values) => {
    values.gender = values.gender === 'male';
    values.wishList = values.wishList.map((item) => ({
      name: item.name,
      image: item.image,
      id: item.id,
      price: item.price
    }));
    values.birthday = values.birthday.format('YYYY-MM-DD');
    values.desiredDate = values.desiredDate.format('YYYY-MM-DD');
    values.id = id;
    dispatch(editAppointment(values));
  };

  useEffect(() => {
    if (userInfo && userInfo.user.roles.includes('user')) {
      dispatch(getProvinceList());
      dispatch(getAppointment(id));
      formRef.current?.setFieldsValue({
        representativeName: userInfo.user.name,
        email: userInfo.user.email,
        representativePhoneNumber: userInfo.user.phoneNumber
      });
    } else {
      navigate('/login');
    }
  }, [userInfo, editSuccess, id]);

  useEffect(() => {
    formRef.current?.setFieldsValue({
      wishList: selectedVaccines
    });
  }, [selectedVaccines]);

  useEffect(() => {
    const province = provinces?.find((item) => item.code == +appointmentItem?.patient?.province);
    const district = province?.districts?.find(
      (item) => item.code == +appointmentItem?.patient?.district
    );
    const ward = district?.wards?.find((item) => item.code == +appointmentItem?.patient?.ward);
    setDistricts(district);
    setWards(wards);
    setDistrictOptions(
      province?.districts?.map((item) => ({ label: item.name, value: item.code }))
    );
    setWardOptions(district?.wards?.map((item) => ({ label: item.name, value: item.code })));
  }, [provinces, appointmentItem]);

  useEffect(() => {
    if (appointmentItem?.desiredDate) {
      dispatch(getScheduleOnDay(moment(appointmentItem?.desiredDate).format('YYYY-MM-DD')));
    }
    setSelectedTag(appointmentItem?.schedule);
    setSelectedVaccines(appointmentItem?.wishList.map((item) => JSON.parse(item)));
    formRef.current?.setFieldsValue({
      patientName: appointmentItem?.patient.patientName,
      patientCode: appointmentItem?.patient.patientCode,
      birthday: appointmentItem?.patient.birthday && moment(appointmentItem?.patient.birthday),
      gender: appointmentItem?.patient.gender == true ? 'male' : 'female',
      phoneNumber: appointmentItem?.patient.phoneNumber,
      province: +appointmentItem?.patient.province,
      district: +appointmentItem?.patient.district,
      ward: +appointmentItem?.patient.ward,
      street: appointmentItem?.patient.street,
      relative: appointmentItem?.relative,
      desiredDate: appointmentItem?.desiredDate && moment(appointmentItem?.desiredDate),
      scheduleId: appointmentItem?.schedule.id,
      wishList: appointmentItem?.wishList.map((item) => JSON.parse(item))
    });
  }, [appointmentItem]);

  return (
    <>
      <div className="appointment-register-page">
        <Container>
          <Row justify="center">
            <Col span={24}>
              {appointmentEdit?.error && <Message description={appointmentEdit.error} />}
              {appointmentEdit?.editSuccess && (
                <Message description="C???p nh???t l???ch h???n th??nh c??ng" />
              )}
              <>
                <h2 className="page-title appointment-register-title">
                  C???p nh???t l???ch h???n ti??m v???c xin
                </h2>
                <Form
                  onFinish={onFinish}
                  ref={formRef}
                  className="appointment-register-form"
                  labelCol={{
                    span: 12
                  }}
                  wrapperCol={{ span: 12 }}
                  labelWrap
                  name="appointment-register-form"
                  labelAlign="left">
                  <Row justify="center">
                    <Col span={18}>
                      <Row justify="center">
                        <Col span={24}>
                          <h4>TH??NG TIN NG?????I TI??M</h4>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={11}>
                          <Form.Item
                            label="H??? v?? t??n ng?????i ti??m"
                            name="patientName"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng nh???p h??? v?? t??n ng?????i ti??m!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            label="M?? ?????nh danh (N???u c??)"
                            name="patientCode"
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            label="Ng??y th??ng n??m sinh"
                            name="birthday"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n ng??y th??ng n??m sinh ng?????i ti??m!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <DatePicker
                              disabledDate={(current) => {
                                let customDate = moment().format('YYYY-MM-DD');
                                return current.diff(moment().startOf('day'), 'days') > 0;
                              }}
                              placeholder="Ng??y/Th??ng/N??m"
                              format="DD-MM-YYYY"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={11}>
                          <Form.Item
                            label="Gi???i t??nh"
                            name="gender"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n gi???i t??nh ng?????i ti??m!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Select
                              options={[
                                {
                                  value: 'male',
                                  label: 'Nam'
                                },
                                {
                                  value: 'female',
                                  label: 'N???'
                                }
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                            label="S??? ??i???n tho???i ng?????i ti??m (n???u c??)"
                            name="phoneNumber"
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={7}>
                          <Form.Item
                            label="T???nh th??nh"
                            name="province"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n t???nh th??nh!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Select
                              onChange={handleChangeProvince}
                              placeholder="Ch???n"
                              options={provinceOptions}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item
                            label="Qu???n huy???n"
                            name="district"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n qu???n huy???n!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Select
                              onChange={handleChangeDistrict}
                              options={districtOptions}
                              placeholder="Ch???n t???nh th??nh tr?????c"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item
                            label="Ph?????ng x??"
                            name="ward"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n ph?????ng x??!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Select options={wardOptions} placeholder="Ch???n ph?????ng x?? tr?????c" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Form.Item
                            label="S??? nh??, t??n ???????ng"
                            name="street"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng nh???p ?????a ch??? li??n h???!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="center">
                        <Col span={24}>
                          <h4>TH??NG TIN NG?????I LI??N H???</h4>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={11}>
                          <Form.Item
                            label="H??? v?? t??n ng?????i li??n h???"
                            name="representativeName"
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                            disabled
                            label="Email"
                            name="email"
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={11}>
                          <Form.Item
                            label="M???i quan h??? v???i ng?????i ti??m"
                            name="relative"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n m???i quan h??? v???i ng?????i ti??m!'
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Select options={relativeOptions} />
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                            label="S??? ??i???n tho???i ng?????i li??n h??? "
                            name="representativePhoneNumber"
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="center">
                        <Col span={24}>
                          <h4>TH??NG TIN D???CH V???</h4>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={24}>
                          <Form.Item
                            label="Ch???n v???c xin ho???c g??i v???c xin"
                            name="wishList"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n v???c xin ! '
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Row justify="space-between">
                              <Col span={16}>
                                <Select
                                  showSearch
                                  placeholder="Ch???n v???c xin"
                                  onChange={onChangeVaccine}
                                  onSearch={onSearchVaccine}
                                  filterOption={(input, option) =>
                                    (option?.label ?? '')
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  options={vaccineOptions}
                                />
                              </Col>
                              <Col span={6}>
                                <Button
                                  type="primary"
                                  style={{ background: '#1f2b6c', border: '#1f2b6c' }}
                                  onClick={handleAddVaccine}>
                                  C???p nh???t l???ch h???n
                                </Button>
                              </Col>
                            </Row>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={24}>
                          <div className="selected-vaccines-card">
                            {selectedVaccines?.map((item) => (
                              <Card
                                key={item.id}
                                extra={
                                  <CloseOutlined
                                    onClick={() => handleRemoveVaccine(item.id)}
                                    className="card-icon"
                                    style={{ cursor: 'pointer' }}
                                  />
                                }
                                hoverable
                                style={{
                                  width: 300,
                                  margin: 10
                                }}
                                cover={
                                  <img
                                    className="vaccine-image-cover"
                                    alt="vaccine-image"
                                    src={item.image}
                                  />
                                }>
                                <Meta
                                  description={
                                    <>
                                      <h5 className="text text--card-title">{item.name}</h5>
                                      <strong className="text text--card-price">{`${item.price}  ???`}</strong>
                                      <p className="text text--card-desc">{item.description}</p>
                                    </>
                                  }
                                />
                              </Card>
                            ))}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p className="wish-list-price">
                            T???ng ti???n: <strong>{`${wishListPrice}   ???`}</strong>
                          </p>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={24}>
                          <Form.Item
                            label="Ng??y mong mu???n ti??m (Ch??? ???????c h???n tr?????c trong v??ng 2 tu???n)"
                            name="desiredDate"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n ng??y mong mu???n ti??m! '
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    (value.diff(moment().startOf('day'), 'days') <= 14 &&
                                      value.diff(moment().startOf('day'), 'days') >= 1)
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      'Vui l??ng ch???n ng??y mong mu???n ti??m tr?????c 1 ng??y v?? trong v??ng 2 tu???n!'
                                    )
                                  );
                                }
                              })
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 11 }}>
                            <DatePicker
                              disabledDate={(current) => {
                                let customDate = moment().format('YYYY-MM-DD');
                                return (
                                  current.diff(moment().startOf('day'), 'days') > 14 ||
                                  current.diff(moment().startOf('day'), 'days') < 1
                                );
                              }}
                              placeholder="Ng??y/Th??ng/N??m"
                              format="DD-MM-YYYY"
                              style={{ width: '100%' }}
                              onChange={handleChangeDay}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col span={24}>
                          <Form.Item
                            label="Ch???n th???i gian (C??c ?? m??u ????? ???? c?? l???ch h???n). L??u ??: Kh??ng th???c hi???n h???n gi??? kh??m ch???a b???nh v??o c??c ng??y l???, t???t."
                            name="scheduleId"
                            rules={[
                              {
                                required: true,
                                message: 'Vui l??ng ch???n th???i gian mong mu???n ti??m! '
                              }
                            ]}
                            labelCol={{
                              span: 24
                            }}
                            wrapperCol={{ span: 24 }}>
                            <Input hidden />
                            <div className="appointment-shift-card">
                              {scheduleOnDay?.loading ? (
                                <Loader />
                              ) : error ? (
                                <Message />
                              ) : !scheduleArr ? (
                                <p>
                                  <AlertOutlined
                                    style={{ color: 'red', fontSize: '25px', margin: '5px' }}
                                  />
                                  Th???i gian c??? th??? ????? ch???n ch??? hi???n th??? n???u ???? ch???n ng??y
                                </p>
                              ) : (
                                scheduleArr?.length &&
                                scheduleArr.map((item, index) =>
                                  item.registerParticipantNumber === item.totalParticipant ? (
                                    <Tag
                                      key={item.id}
                                      className="appointment-shift-tag"
                                      style={{
                                        margin: '10px',
                                        border: ' 2px solid #ff4d4f',
                                        color: '#fcfefe',
                                        backgroundColor: '#1f2b6c'
                                      }}>
                                      {`${item.startAt} - ${item.endAt}`}
                                    </Tag>
                                  ) : (
                                    <CheckableTag
                                      className="appointment-shift-tag"
                                      style={{
                                        margin: '10px',
                                        border: ' 2px solid #87d068',
                                        color: '#fcfefe'
                                      }}
                                      key={item.id}
                                      checked={item.id === selectedTag?.id}
                                      onChange={(checked) => handleChangeTag(item, checked)}>
                                      {`${item.startAt} - ${item.endAt}`}
                                    </CheckableTag>
                                  )
                                )
                              )}
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider />
                      <Row justify="center">
                        <Col span={4} onClick={() => navigate('/appointment-history')}>
                          <Button type="primary">H???y c???p nh???t</Button>
                        </Col>
                        <Col>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                              background: '#bfd2f8',
                              border: '#bfd2f8',
                              color: '#1f2b6c'
                            }}>
                            C???p nh???t l???ch h???n
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserUpdateAppointmentPage;
