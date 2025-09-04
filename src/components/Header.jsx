import { Navbar, Container, Nav, Button } from "react-bootstrap";
import logo from "../assets/logo.gif";

import { loginWithGoogle, logout } from "../firebase.config";

export default function Header({ user, onShowFavourites }) {
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container className="justify-content-between">
        <Nav>
          <Button variant="outline-primary" onClick={onShowFavourites}>
            Favourites
          </Button>
        </Nav>
        <div className="d-flex align-items-center">
          <img src={logo} className="img-fluid me-2" style={{ height: '40px' }} alt="Logo" />
          <Navbar.Brand href="#home" className="fw-bold m-0">
            One Ingredient Chef
          </Navbar.Brand>
        </div>
        <Nav>
          {user ? (
            <Button variant="outline-danger" onClick={logout}>Logout</Button>
          ) : (
            <Button variant="outline-success" onClick={loginWithGoogle}>Login with Google</Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
