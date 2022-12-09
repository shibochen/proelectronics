import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { logout } from "../redux/slices/userSlices";
import SearchBox from "./SearchBox";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Pro Tech Electronics</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                userInfo && userInfo.isAdmin ? (
                  <NavDropdown title="Admin" id="adminmenu">
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                )
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
