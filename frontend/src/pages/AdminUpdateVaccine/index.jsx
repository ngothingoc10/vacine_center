import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  InputNumber,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Select,
  Divider,
  Button,
  Image
} from 'antd';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getCategoryList, getAgeGroups } from '../../actions/category.action';
import { getVaccine, editVaccine } from '../../actions/vaccine.action';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;

const AdminUpdateVaccine = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [imageFile, setImageFile] = useState();

  const vaccineList = useSelector((state) => state.vaccineList);
  const { vaccines } = vaccineList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  const ageGroupsCategoryList = useSelector((state) => state.ageGroupsCategoryList);
  const { ageGroups } = ageGroupsCategoryList;

  const vaccineItem = useSelector((state) => state.vaccine);
  const { vaccine } = vaccineItem;

  const vaccineEdit = useSelector((state) => state.vaccineEdit);
  const { editSuccess } = vaccineEdit;

  const onChange = (e) => {
    let files = e.target.files;
    setImageFile(files[0]);
    let reader = new FileReader();

    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };

    reader.readAsDataURL(files[0]);
  };

  const handleSave = (values) => {
    values.imageFile = imageFile;
    values.id = id;
    console.log('onFinish', values);
    dispatch(editVaccine(values));
  };

  useEffect(() => {
    if (userInfo && userInfo.user.roles.includes('admin')) {
      dispatch(getCategoryList({}));
      dispatch(getAgeGroups());
      dispatch(getVaccine(id));
    } else {
      navigate('/login');
    }
  }, [userInfo, id]);

  useEffect(() => {
    formRef.current?.setFieldsValue({
      name: vaccine?.name,
      image: vaccine?.image,
      vaccineCode: vaccine?.vaccineCode,
      origin: vaccine?.origin,
      price: vaccine?.price,
      description: vaccine?.description,
      categoryId: vaccine?.categoryId,
      injectedNumberTotal: vaccine?.injectedNumberTotal,
      ageGroupIds: vaccine?.ageGroups?.map((item) => item.id)
    });
  }, [vaccine]);

  return userLogin.loading ||
    categoryList.loading ||
    ageGroupsCategoryList.loading ||
    vaccineItem.loading ? (
    <Loader />
  ) : userLogin.error || categoryList.error || ageGroupsCategoryList.error || vaccineItem.error ? (
    <Message description={error} />
  ) : (
    <Card loading={false} className="add-vaccine-card">
      {vaccineEdit.error === 'Validation error' && <Message description="M?? v???c xin ???? t???n t???i!" />}
      {editSuccess && <Message description="B???n ???? c???p nh???t v???c xin th??nh c??ng!" />}
      <h2 className="page-title">C???p nh???t v???c xin</h2>
      <Row justify="space-around">
        <Col span={6}>
          <Image
            src={imageSrc ? imageSrc : vaccine?.image}
            className="preview-image"
            fallback="data:image/png;base64,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"
          />
          <input
            type="file"
            class="custom-file-input"
            name="image-file"
            onChange={(e) => onChange(e)}
          />
        </Col>
        <Col span={12}>
          <Form
            ref={formRef}
            className="add-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            name="product-form"
            onFinish={handleSave}>
            <Form.Item
              label="T??n"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p t??n v???c xin!',
                  whitespace: true
                }
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="M?? v???c xin"
              name="vaccineCode"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p m?? v???c xin!',
                  whitespace: true
                }
              ]}>
              <Input />
            </Form.Item>
            <Form.Item label="???nh" name="image" style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngu???n g???c"
              name="origin"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p ngu???n g???c v???c xin!',
                  whitespace: true
                }
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Gi??"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p gi?? v???c xin!'
                }
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="S??? m??i theo ph??c ?????"
              name="injectedNumberTotal"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p s??? m??i theo ph??c ?????!'
                }
              ]}>
              <InputNumber min={1} max={10} />
            </Form.Item>
            <Form.Item
              label="M?? t???"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p m?? t??? v???c xin!',
                  whitespace: true
                }
              ]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Ph??ng b???nh"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng ch???n lo???i b???nh ph??ng c???a v???c xin!'
                }
              ]}>
              <Select placeholder="Ch???n lo???i v???c xin">
                {categories?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="?????i t?????ng"
              name="ageGroupIds"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng ch???n ?????i t?????ng ???????c d??ng!'
                }
              ]}>
              <Checkbox.Group
                options={ageGroups?.map((item) => ({ label: item.name, value: item.id }))}
              />
            </Form.Item>
            <Divider />
            <Row justify="center">
              <Button
                type="primary"
                className="btn-cancel"
                onClick={() => {
                  navigate('/admin-home/vaccines');
                }}>
                H???y
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="btn-add"
                style={{ background: '#198754', border: '#198754' }}>
                C???p nh???t
              </Button>
            </Row>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};
export default AdminUpdateVaccine;
