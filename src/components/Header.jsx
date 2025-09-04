import { Navbar, Container, Nav, Button } from "react-bootstrap";
import logo from "../assets/logo.gif";

export default function Header({ onShowFavourites }) {
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container className="justify-content-between">
        <Nav>
          <Nav.Link onClick={onShowFavourites}>Favourites</Nav.Link>
        </Nav>
        <div className="d-flex align-items-center">
          <img src={logo} className="img-fluid me-2" style={{ height: '40px' }} alt="Logo" />
          <Navbar.Brand href="#home" className="fw-bold m-0">
            One Ingredient Chef
          </Navbar.Brand>
        </div>
        <Nav>
          <Nav.Link href="#">New recipe</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
