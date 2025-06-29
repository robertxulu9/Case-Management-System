import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavScrollExample() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary " fixed="top"style={{  zIndex: 1050 }}>
        <Container fluid>
          <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="#action1">Home</Nav.Link>
              <Nav.Link href="#action2">Link</Nav.Link>
              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#" disabled>
                Link
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>



          
          
          
        </Container>
      </Navbar>
            {/* Line Under Navbar */}
            <div style={{ borderTop: '1px solid rgb(255, 255, 255)', marginTop: '100x' }}></div>
      <Navbar expand="lg mt-5 py-0" className="bg-body-tertiary" fixed="top">



      {/* Row of Links Below Navbar */}
      <div className="bg-light py-2" fixed="top">
        <Container expand="lg" className="bg-body-tertiary" fixed="top">
          <div className="d-flex justify-content-center gap-4" fixed="top">
            <a href="#sublink1" className="text-secondary text-decoration-none">
              Sub-Link 1
            </a>
            <a href="#sublink2" className="text-secondary text-decoration-none">
              Sub-Link 2
            </a>
            <a href="#sublink3" className="text-secondary text-decoration-none">
              Sub-Link 3
            </a>
            <a href="#sublink4" className="text-secondary text-decoration-none">
              Sub-Link 4
            </a>
          </div>
        </Container>
      </div>
      </Navbar>
      
    </>
  );
}

export default NavScrollExample;
