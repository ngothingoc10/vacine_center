import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, List, Button, Popconfirm, Form } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TinyMceEditor from '../../components/TinyMceEditor';
import {
  createVaccineDetail,
  getVaccineDetails,
  deleteVaccineDetail,
  editVaccineDetail
} from '../../actions/vaccine_detail.action';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import './index.css';
import {
  VACCINE_INFORM_CREATE_REQUEST,
  VACCINE_INFORM_EDIT_REQUEST,
  VACCINE_INFORM_DELETE_REQUEST
} from '../../constants/vaccine.constant';

const AdminDetailVaccine = () => {
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [okText, setOkText] = useState();
  const [contentInform, setContentInform] = useState();
  const [titleInform, setTitleInform] = useState();
  const [informId, setInformId] = useState();
  const [action, setAction] = useState();
  const vaccineInformTitleRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const vaccineList = useSelector((state) => state.vaccineList);
  const { vaccines } = vaccineList;
  const vaccine = vaccines?.find((item) => item.id == id);

  const vaccineInformCreate = useSelector((state) => state.vaccineInformCreate);
  const { createSuccess } = vaccineInformCreate;

  const vaccineDetails = useSelector((state) => state.vaccineInformList);
  const { vaccineInforms } = vaccineDetails;

  const vaccineInformDelete = useSelector((state) => state.vaccineInformDelete);
  const { deleteSuccess } = vaccineInformDelete;

  const vaccineInformEdit = useSelector((state) => state.vaccineInformEdit);
  const { editSuccess } = vaccineInformEdit;

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const onChangeTitleInform = (e) => {
    setTitleInform(e.target.value);
  };

  const handleOnClick = () => {
    setTitleInform('');
    setContentInform('');
    setModalTitle('Th??m th??ng tin chi ti???t v???c xin');
    setOkText('Th??m');
    showModal();
  };

  const handleOk = () => {
    const vaccineInformTitle = vaccineInformTitleRef.current.input.value;
    const vaccineDetail = {
      title: vaccineInformTitle,
      content: contentInform,
      vaccineId: id
    };

    console.log("!okText.localeCompare('Th??m')", !okText.localeCompare('Th??m'));
    if (!okText.localeCompare('Th??m')) {
      setAction(VACCINE_INFORM_CREATE_REQUEST);
      dispatch(createVaccineDetail(vaccineDetail));
    } else {
      setAction(VACCINE_INFORM_EDIT_REQUEST);
      dispatch(editVaccineDetail({ vaccineDetail, informId }));
    }
    hideModal();
  };

  const handleEditVaccineInform = (informId) => {
    setInformId(informId);
    const vaccineInformItem = vaccineInforms.find((item) => item.id == informId);
    setContentInform(vaccineInformItem.content);
    setTitleInform(vaccineInformItem.title);
    setModalTitle('Ch???nh s???a th??ng tin chi ti???t v???c xin');
    setOkText('Ch???nh s???a');
    showModal();
  };

  const handleDeleteVaccineInform = (informId) => {
    setAction(VACCINE_INFORM_DELETE_REQUEST);
    setInformId(informId);
    dispatch(deleteVaccineDetail(informId));
  };

  useEffect(() => {
    if (userInfo && userInfo.user.roles.includes('admin')) {
      dispatch(getVaccineDetails(id));
    } else {
      navigate('/login');
    }
  }, [userInfo, id, createSuccess, deleteSuccess, editSuccess]);

  let message;
  if (deleteSuccess && !action.localeCompare(VACCINE_INFORM_DELETE_REQUEST)) {
    message = <Message description="X??a th??ng tin v???c xin th??nh c??ng!" type="success" />;
  }
  if (editSuccess && !action.localeCompare(VACCINE_INFORM_EDIT_REQUEST)) {
    message = <Message description="C???p nh???t th??ng tin v???c xin th??nh c??ng!" type="success" />;
  }
  if (createSuccess && !action.localeCompare(VACCINE_INFORM_CREATE_REQUEST)) {
    message = <Message description="T???o th??ng tin v???c xin th??nh c??ng!" type="success" />;
  }

  return vaccineDetails.loading ? (
    <Loader />
  ) : vaccineDetails.error ? (
    <Message description={vaccineDetails.error} />
  ) : (
    <>
      {message}
      <div className="admin-detail-vaccine">
        <section className="section-admin-vaccine-base-inform">
          <div className="admin-vaccine-image">
            <img src={vaccine?.image} />
          </div>
          <div className="admin-vaccine-base-inform">
            <h2 className="admin-vaccine-name">{vaccine?.name}</h2>
            <hr />
            <p className="admin-vaccine-des">{vaccine?.description}</p>
            <p className="admin-vaccine-origin">
              <span>Ngu???n g???c: </span>
              {vaccine?.origin}
            </p>
            <p className="admin-vaccine-quantity">
              <span>S??? l?????ng: </span>
              {vaccine?.quantity}
            </p>
            <p className="admin-vaccine-price">
              <span>{`${vaccine.price} ???`}</span>
            </p>
          </div>
        </section>
        <section className="section-admin-vaccine-detail-inform">
          <h3 className="admin-inform-heading">Th??ng tin chi ti???t vaccine</h3>
          <button className="admin-add-inform-btn" onClick={handleOnClick}>
            Th??m th??ng tin chi ti???t
          </button>
          <List
            className="admin-inform-list"
            bordered="true"
            itemLayout="horizontal"
            size="large"
            dataSource={vaccineInforms}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                className="admin-inform-item"
                actions={[
                  <>
                    <Button
                      type="primary"
                      danger
                      style={{ float: 'right', marginLeft: '10px' }}
                      // onClick={showModal}
                    >
                      <Popconfirm
                        title="Sure to delete?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => handleDeleteVaccineInform(item.id)}>
                        <DeleteOutlined />
                      </Popconfirm>
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => handleEditVaccineInform(item.id)}
                      style={{ background: '#ffc107', border: '#ffc107' }}>
                      <EditOutlined />
                    </Button>
                  </>
                ]}>
                <List.Item.Meta
                  title={<Link to={'/vaccine-detail/' + id}>{`${index + 1}. ${item.title}`}</Link>}
                />
              </List.Item>
            )}
          />
        </section>
      </div>
      <Modal
        className="modal-vaccine-inform"
        title={modalTitle}
        open={open}
        onOk={handleOk}
        onCancel={hideModal}
        okText={okText}
        cancelText="H???y"
        width={1000}>
        <Form>
          <Form.Item label="Ti??u ????? th??ng tin v???c xin" className="vaccinee-subject-input">
            <Input
              ref={vaccineInformTitleRef}
              placeholder="Ti??u ????? th??ng tin v???c xin"
              value={titleInform}
              onChange={onChangeTitleInform}
            />
          </Form.Item>
          <TinyMceEditor contentInform={contentInform} setContentInform={setContentInform} />
        </Form>
      </Modal>
    </>
  );
};

export default AdminDetailVaccine;
