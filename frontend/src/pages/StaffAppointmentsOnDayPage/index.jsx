import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Input, Button, Select, Row, Col, Card, Form } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getScheduleOnDay } from '../../actions/schedule.action';
import { getAppointmentHistories } from '../../actions/appointment.action';
import moment from 'moment';
import './index.css';

const StaffAppointmentsOnDayPage = () => {
  const DEFAULT_PAGE_NUMBER = 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const appointmentList = useSelector((state) => state.appointmentList);
  const { loading, error, appointmentHistories, totalItem } = appointmentList;

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);
  const scheduleOnDay = useSelector((state) => state.scheduleOnDay);
  const { schedules } = scheduleOnDay;
  let scheduleOptions = schedules?.map((item) => ({
    key: item.id,
    label: `${moment(moment(item.startAt, 'HH:mm')).format('HH:mm')} - ${moment(
      moment(item.startAt, 'HH:mm')
    )
      .add(item.appointmentDuration, 'minutes')
      .format('HH:mm')}`,
    value: item.id
  }));

  const handleTableChange = (pagination) => {
    dispatch(
      getAppointmentHistories({
        perPage: 10,
        page: pagination.current,
        desiredDate: currentDay,
        isCheckIn: true
      })
    );
    setCurrentPage(pagination.current - 1);
  };

  const handleOnSearch = (values) => {
    dispatch(
      getAppointmentHistories({
        perPage: 10,
        desiredDate: currentDay,
        isCheckIn: true,
        patientCode: values.patientCode,
        patientName: values.patientName,
        scheduleId: values.schedule
      })
    );
  };

  const currentDay = moment().format('YYYY-MM-DD');
  useEffect(() => {
    if (userInfo && userInfo.user.roles.includes('staff')) {
      dispatch(getScheduleOnDay(currentDay));
      dispatch(
        getAppointmentHistories({
          perPage: 10,
          desiredDate: currentDay,
          isCheckIn: true
        })
      );
      // dispatch(
      //   getAppointmentHistories({
      //     perPage: 10,
      //     desiredDate: '2022-12-17',
      //     isCheckIn: true
      //   })
      // );
    } else {
      navigate('/login');
    }
  }, [currentDay, userInfo]);
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'key',
      align: 'center'
    },
    {
      title: 'M?? ?????nh danh',
      dataIndex: 'code',
      key: 'code',
      align: 'center'
    },
    {
      title: 'T??n ng?????i ti??m',
      dataIndex: 'patientName',
      key: 'patientName',
      align: 'center'
    },
    {
      title: 'Ng??y sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      align: 'center'
    },
    {
      title: 'Th???i gian',
      dataIndex: 'schedule',
      key: 'schedule',
      align: 'center'
    },

    {
      title: 'T??n v???c xin',
      dataIndex: 'wishList',
      key: 'wishList',
      render: (wishList) =>
        wishList?.map((item, index) => (
          <ol>
            <li>{`${index + 1}. ${JSON.parse(item).name}`}</li>
          </ol>
        ))
    },
    {
      title: '???? kh??m s??n l???c',
      dataIndex: 'screeningTest',
      key: 'screeningTest',
      align: 'center',
      render: (value) =>
        value ? (
          <CheckOutlined style={{ color: 'blue' }} />
        ) : (
          <CloseOutlined style={{ color: 'red' }} />
        )
    }
    // {
    //   title: '???? ti??m',
    //   dataIndex: 'injections',
    //   align: 'center',
    //   key: 'injections',
    //   render: (value) =>
    //     value?.length ? (
    //       <CheckOutlined style={{ color: 'blue' }} />
    //     ) : (
    //       <CloseOutlined style={{ color: 'red' }} />
    //     )
    // }
  ];
  const data = {};
  data.totalElements = totalItem;
  data.content = appointmentHistories?.map((item, index) => ({
    key: item.id,
    index: index + 1,
    code: item.patient.patientCode,
    patientName: item.patient.patientName,
    birthday: moment(item.birthday).format('DD/MM/YYYY'),
    schedule: `${moment(moment(item.schedule?.startAt, 'HH:mm')).format('HH:mm')}-${moment(
      moment(item.schedule?.startAt, 'HH:mm')
    )
      .add(item.schedule?.appointmentDuration, 'minutes')
      .format('HH:mm')}`,
    wishList: item.wishList,
    screeningTest: item.screeningTest
    // injections: item.injections
  }));

  return (
    <div>
      <Card style={{ borderRadius: 10 }}>
        <h2 className="page-title">Qu???n l?? l???ch ti??m ch???ng trong ng??y</h2>
        <Form onFinish={handleOnSearch}>
          <Row justify="space-evenly">
            <Col>
              <Form.Item name="patientCode">
                <Input placeholder="T??m theo m?? ?????nh danh" style={{ float: 'left' }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="patientName">
                <Input placeholder="T??m t??n ng?????i ti??m" style={{ float: 'left', width: 250 }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="schedule">
                <Select
                  showSearch
                  placeholder="Ch???n khung gi???"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={scheduleOptions}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                T??m ki???m
              </Button>
            </Col>
          </Row>
        </Form>

        <Table
          bordered
          style={{ marginTop: 20 }}
          rowKey={(record) => record.key}
          onRow={(record) => {
            return {
              onClick: () => {
                console.log('record', record);
                navigate(`/staff-home/appointments-on-day/details/${record.key}`);
              }
            };
          }}
          dataSource={data.content}
          columns={columns}
          onChange={handleTableChange}
          pagination={{
            pageSize: 10,
            current: currentPage + 1,
            total: data.totalElements,
            showTotal: (total, range) => {
              return `${range[0]}-${range[1]} of ${total} items`;
            }
          }}
        />
      </Card>
    </div>
  );
};

export default StaffAppointmentsOnDayPage;
