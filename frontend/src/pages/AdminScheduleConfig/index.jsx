import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Card, Row, Col, Divider, Button, Modal , Popconfirm} from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import FormConfig from '../../components/FormConfig';
import {
  getScheduleConfigs,
  createScheduleConfig,
  editScheduleConfig
} from '../../actions/schedule_config.action';
import './index.css';

const AdminScheduleConfig = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const scheduleConfigs = useSelector((state) => state.scheduleConfigs);
  const { scheduleConfigList, error, loading } = scheduleConfigs;

  const scheduleConfigCreate = useSelector((state) => state.scheduleConfigCreate);
  const { createSuccess } = scheduleConfigCreate;

  // const scheduleConfigEdit = useSelector((state) => state.scheduleConfigEdit);
  // const { editSuccess } = scheduleConfigEdit;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAdd = (scheduleConfig) => {
    dispatch(createScheduleConfig(scheduleConfig));
    handleCancel();
  };

  let id;
  if (scheduleConfigList) {
    id = scheduleConfigList[1]?.id;
  }
  const handleEdit = (scheduleConfig) => {
    dispatch(editScheduleConfig({ scheduleConfig, id }));
    handleCancel();
  };

  useEffect(() => {
    if (userInfo && userInfo.user.roles.includes('admin')) {
      dispatch(getScheduleConfigs());
    } else {
      navigate('/login');
    }
  }, [userInfo, createSuccess]);

  return loading ? (
    <Loader />
  ) : error || scheduleConfigCreate.error ? (
    <Message
      description={`${error ? error : ''} ${
        scheduleConfigCreate.error ? scheduleConfigCreate.error : ''
      } `}
    />
  ) : (
    <>
      {(createSuccess ) && (
        <Message description="C??i ?????t l???ch th??nh c??ng" type="success" />
      )}
      <Card loading={false} className="appointment-schedule-card">
        <h2 className="page-title">C??i ?????t khung gi??? h???n</h2>
        {scheduleConfigList?.length &&
          scheduleConfigList.map((item, index) => (
            <Row justify="center" key={item.id}>
              <Col span={14}>
                <FormConfig
                  appointmentConfig={{ ...item, index: index }}
                  okText="C???p nh???t"
                  handleOnSubmit={handleEdit}
                />
                <Divider />
              </Col>
            </Row>
          ))}

        {scheduleConfigList?.length < 2 && (
          <Row justify="center">
            <Col>
              <Button type="primary" className="btn-cancel" onClick={showModal}>
                Th??m
              </Button>
            </Col>
          </Row>
        )}
      </Card>
      <Modal
        title="Th??m c??i ?????t c??c khung gi??? l??m vi???c"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}>
        <FormConfig handleOnSubmit={handleAdd} okText="Th??m" handleCancel={handleCancel} />
      </Modal>
    </>
  );
};

export default AdminScheduleConfig;
