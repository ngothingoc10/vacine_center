import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Row, Col, Input, Modal, Card, Upload , Form, Select} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getSignedRequest } from '../../actions/upload.action';
import { getVaccineListWarehouse, createVaccineWarehouse } from '../../actions/warehouse.action';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import moment from 'moment';
import './index.css';

const { Search } = Input;

const AdminWarehousePage = () => {
  const DEFAULT_PAGE_NUMBER = 0;
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const upload = useSelector((state) => state.upload);
  const { imageUrl } = upload;

  const vaccineWareHouseCreate = useSelector((state) => state.vaccineWareHouseCreate);
  const { createSuccess } = vaccineWareHouseCreate;

  const vaccineListWareHouse = useSelector((state) => state.vaccineListWareHouse);
  const { loading, error, vaccineItemList, totalItem } = vaccineListWareHouse;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeUpload = (file) => {
    dispatch(getSignedRequest(file.file));
  };

  const handleTableChange = (pagination) => {
    dispatch(getVaccineListWarehouse({ perPage: 10, page: pagination.current }));
    setCurrentPage(pagination.current - 1);
  };

  const onFinish = (values) => {
    let query = {
      perPage: 10,
      vaccineCode: values.code,
      vaccineName: values.name
    }
    
    if (values.status === 1) {
      query = { ...query, isExpired: 'true' };
    }
    if (values.status === 2) {
      query = { ...query, expiredDay: 30  };
    }
   
    dispatch(getVaccineListWarehouse(query));
  };


  useEffect(() => {
    if (imageUrl) {
      const arr = imageUrl.split('/vaccines/');
      dispatch(createVaccineWarehouse(arr[1]));
    }
  }, [imageUrl]);

  useEffect(() => {
    if (userInfo && userInfo.user.roles.includes('admin')) {
      dispatch(getVaccineListWarehouse({ perPage: 10 }));
    } else {
      navigate('/login');
    }
  }, [userInfo, createSuccess]);

     const statusOptions = [
    { label: '???? h???t h???n', value: 1 },
    { label: 'S??? h???t h???n trong v??ng 30 ng??y', value: 2 },
  ];

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'key',
      align: 'center'
    },
    {
      title: 'M?? v???c xin',
      dataIndex: 'vaccineCode',
      key: 'vaccineCode',
      align: 'center'
    },
    {
      title: 'T??n v???c xin',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
      align: 'center'
    },

    {
      title: 'S??? l?????ng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: 'Gi??/1 s???n ph???m',
      dataIndex: 'price',
      key: 'price',
      align: 'center'
    },
    {
      title: 'Ng??y s???n xu???t',
      dataIndex: 'manufactureDate',
      key: 'manufactureDate',
      align: 'center'
    },
    {
      title: 'H???n s??? d???ng',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      align: 'center'
    },
    {
      title: 'Ng??y nh???p',
      dataIndex: 'importDate',
      key: 'importDate',
      align: 'center'
    }
  ];
  const data = {};
  data.totalElements = totalItem;
  data.content = vaccineItemList?.map((item, index) => ({
    key: item.id,
    index: currentPage * 10 + index + 1,
    vaccineCode: item.vaccine.vaccineCode,
    vaccineName: item.vaccine.name,
    quantity: item.quantity,
    price: item.price,
    manufactureDate: item.manufactureDate && moment(item.manufactureDate).format('DD/MM/YYYY'),
    expirationDate: item.expirationDate && moment(item.expirationDate).format('DD/MM/YYYY'),
    importDate: item.importDate && moment(item.importDate).format('DD/MM/YYYY')
  }));

  return (
    <div>
      <Card style={{ borderRadius: 10 }}>
        <h2 className="page-title">Qu???n l?? kho v???c xin</h2>
        <Form onFinish={onFinish}>
          <Row justify="space-between">
            <Col span={6}>
              <Form.Item name="code">
                <Input placeholder="T??m theo m?? v???c xin" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="name">
                <Input placeholder="T??m theo t??n v???c xin" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="status">
              <Select
                  showSearch
                  placeholder="T??nh tr???ng"
                  optionFilterProp="children"
                  options={statusOptions}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item >
               <Button type="primary"  htmlType='submit'>T??m ki???m</Button>
              </Form.Item>
            </Col>

        <Col>
          <Upload
            accept=".xls, .xlsx"
            showUploadList={false}
            onChange={(file) => onChangeUpload(file)}
            beforeUpload={(file) => {
              const reader = new FileReader();

              reader.onload = (e) => { };
              reader.readAsText(file);

              // Prevent upload
              return false;
            } }>
            <Button type="primary" icon={<UploadOutlined />}>
              Nh???p kho v???c xin
            </Button>
          </Upload>
        </Col>
      </Row>
      </Form>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message description={error} />
      ) : (
        <Table
          style={{ marginTop: 20 }}
          rowKey={(record) => record.key}
          onRow={(record) => {
            return {
              onClick: () => {
                const id = record.key;
                const vaccineItem = vaccineItemList.find((item) => (item.id = id));
                setSelectedRow(vaccineItem);
                showModal();
              }
            };
          } }
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
          }} />
      )}
      {vaccineWareHouseCreate?.error && <Message description={vaccineWareHouseCreate.error} />}
    </Card><Modal width={900} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Card className="warehouse-card">
          <h2 className="page-title">Th??ng tin chi ti???t ????n h??ng nh???p kho v???c xin</h2>
          <Row justify="space-around">
            <Col span={24}>
              <Row>
                <Col>
                  <span>
                    M?? v???c xin: <strong>{selectedRow?.vaccine.vaccineCode}</strong>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>
                    T??n v???c xin: <strong>{selectedRow?.vaccine.name}</strong>
                  </span>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={8}>
                  <span>
                    S??? l?????ng: <strong>{selectedRow?.quantity}</strong>
                  </span>
                </Col>
                <Col span={8}>
                  <span>
                    Gi?? / 1 s???n ph???m: <strong>{selectedRow?.price}</strong>
                  </span>
                </Col>
                <Col span={8}>
                  <span>
                    Ng??y nh???p:{' '}
                    <strong>
                      {selectedRow?.importDate &&
                        moment(selectedRow?.importDate).format('DD/MM/YYYY')}
                    </strong>
                  </span>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={8}>
                  <span>
                    Ng??y s???n xu???t:{' '}
                    <strong>
                      {selectedRow?.manufactureDate &&
                        moment(selectedRow?.manufactureDate).format('DD/MM/YYYY')}
                    </strong>
                  </span>
                </Col>
                <Col span={8}>
                  <span>
                    L?? s???n xu???t: <strong>{selectedRow?.productionBatch}</strong>
                  </span>
                </Col>
                <Col span={8}>
                  <span>
                    H???n s??? d???ng:{' '}
                    <strong>
                      {selectedRow?.expirationDate &&
                        moment(selectedRow?.expirationDate).format('DD/MM/YYYY')}
                    </strong>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>
                    Nh?? cung c???p: <strong>{selectedRow?.supplier}</strong>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span>
                    S??? ??i???n tho???i nh?? cung c???p: <strong>{selectedRow?.supplierPhoneNumber}</strong>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>
                    T???ng ti???n ????n h??ng:
                    <strong>{+selectedRow?.price * +selectedRow?.quantity}</strong>
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Modal>
    </div>
  );
};

export default AdminWarehousePage;
