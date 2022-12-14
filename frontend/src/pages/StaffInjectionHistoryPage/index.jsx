import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Input, Row, Col, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { getScheduleOnDay } from '../../actions/schedule.action';
import { getPatientList } from '../../actions/patient.action';
import moment from 'moment';
import './index.css';

const { Search } = Input;

const StaffInjectionHistoryPage = () => {
  const DEFAULT_PAGE_NUMBER = 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const patientList = useSelector((state) => state.patientList);
  const { loading, error, patients, totalItem } = patientList;

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

  const handleChangeDay = (date) => {
    const selectedDay = moment(date).format('YYYY-MM-DD');
    dispatch(getScheduleOnDay(selectedDay));
  };

  const handleTableChange = (pagination) => {
    dispatch(getPatientList({ perPage: 10, page: pagination.current }));
    setCurrentPage(pagination.current - 1);
  };

  const onSearchPatientCode = (value) => {
    dispatch(
      getPatientList({
        perPage: 10,
        patientCode: value
      })
    );
  };

  const onSearchPatientName = (value) => {
    dispatch(
      getPatientList({
        perPage: 10,
        patientName: value
      })
    );
  };

  useEffect(() => {
    if (userInfo && userInfo.user.roles.includes('staff')) {
      dispatch(getPatientList({ perPage: 10 }));
    } else {
      navigate('/login');
    }
  }, [userInfo]);
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
      title: 'T??n b???nh nh??n',
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
      title: 'S??? ??i???n tho???i',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center'
    },
    {
      title: 'Xem chi ti???t',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (value) => <Link to={value}>Xem chi ti???t</Link>
    }
  ];
  const data = {};
  data.totalElements = totalItem;
  data.content = patients?.map((item, index) => ({
    key: item.id,
    index: currentPage * 10 + index + 1,
    code: item.patientCode,
    phoneNumber: item.phoneNumber,
    patientName: item.patientName,
    birthday: moment(item.birthday).format('DD/MM/YYYY'),
    action: `details/${item.id}`
  }));

  return (
    <div>
      <Card style={{ borderRadius: 10 }}>
        <h2 className="page-title">H??? s?? ti??m ch???ng b???nh nh??n</h2>
        <Row justify="space-evenly">
          <Col span={8}>
            <Search onSearch={onSearchPatientCode} placeholder="T??m theo m?? ?????nh danh" />
          </Col>
          <Col span={8}>
            <Search onSearch={onSearchPatientName} placeholder="T??m theo t??n b???nh nh??n" />
          </Col>
        </Row>

        <Table
          style={{ marginTop: 20 }}
          rowKey={(record) => record.key}
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

export default StaffInjectionHistoryPage;
