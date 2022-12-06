import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Button, Dropdown } from 'antd';
import 'antd/dist/antd.css';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../../layout/Container';
import { logout } from '../../actions/user.action';
import './index.css';
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const items = [
    {
      label: (
        <Link
          to="/login"
          onClick={(e) => {
            e.preventDefault();
            handleLogout(e);
          }}>
          Đăng xuất
        </Link>
      ),
      key: 'log-out',
      icon: (
        <LogoutOutlined
          style={{
            fontSize: '20px'
          }}
        />
      ),
      className: 'dropdown-account__item'
    },
    {
      label: (
        <Link
          to=""
          onClick={(e) => {
            e.preventDefault();
            handleLogout(e);
          }}>
          Tài khoản
        </Link>
      ),
      key: 'profile',
      icon: (
        <LogoutOutlined
          style={{
            fontSize: '20px'
          }}
        />
      ),
      className: 'dropdown-account__item'
    }
  ];

  return (
    <header className="page-header">
      <div className="header-top">
        <Container>
          <Link to="/" className="logo">
            MEDDICAL
          </Link>
          <ul className="header-actions">
            <li className="header-action__emergency">
              <ul className="header-action__item">
                <li>LIÊN HỆ</li>
                <li>
                  <time>0364675651</time>
                </li>
              </ul>
            </li>
            <li className="header-action__time">
              <ul className="header-action__item">
                <li>GIỜ LÀM VIỆC</li>
                <li>
                  <time>07:00 - 20:00 Everyday</time>
                </li>
              </ul>
            </li>
            <li className="header-action__location">
              <ul className="header-action__item">
                <li>LOCATION</li>
                <li>
                  <time>57 Ngô Thì Nhậm</time>
                </li>
              </ul>
            </li>
          </ul>
        </Container>
      </div>
      <nav className="header-nav">
        <Container>
          <div className="header-nav-card">
            <ul className="header-menu">
              <li className="header-menu__item">
                <a href="#" className="header-menu-item__link">
                  Trang chủ
                </a>
              </li>
              <li className="header-menu__item">
                <a href="#" className="header-menu-item__link">
                  Giới thiệu
                </a>
              </li>
              <li className="header-menu__item">
                <a href="#" className="header-menu-item__link">
                  Gói tiêm
                </a>
              </li>
              <li className="header-menu__item">
                <a href="#" className="header-menu-item__link">
                  Cẩm nang
                </a>
                <ul className="header-menu-sub">
                  <li className="header-menu-sub__item">
                    <a href="/vaccine-list" className="menu-sub-item__link">
                      Thông tin vắc xin
                    </a>
                  </li>
                  <li className="header-menu-sub__item">
                    <a href="" className="menu-sub-item__link">
                      Bảng giá
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="header-user-action">
              <Button
                type="primary"
                className="appointment-register-btn"
                style={{ background: '#bfd2f8', border: '#bfd2f8' }}
                onClick={() => navigate('/register-appointment')}>
                Đăng kí tiêm
              </Button>
              <div className="user-info">
                {userInfo ? (
                  <Dropdown menu={{ items }}>
                    <div>
                      <span className="user-info__name">{userInfo.user.name}</span>
                      <Avatar size="large" icon={<UserOutlined />} />
                    </div>
                  </Dropdown>
                ) : (
                  <Button
                    type="primary"
                    className="user-info__login-btn"
                    style={{ background: '#ffc107', border: '#ffc107' }}
                    onClick={() => navigate('/login')}>
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
};

export default Header;
