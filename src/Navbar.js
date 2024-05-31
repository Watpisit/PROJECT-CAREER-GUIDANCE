import './NavbarSidebar.css'
import { Nav, Col, Image } from 'react-bootstrap';
import { React } from 'react'
import { Link } from 'react-router-dom';


export default function Navbar({ isActive }) {


    return (
        <>

        

            <Col sm={3} md={2}>
                <div className='div-sidebar1' >
                    <div className='div-sidebar2' >
                        <Nav className="flex-column " >
                            <div className="logo-container d-flex justify-content-center align-items-center">
                                <Image src="https://sv1.picz.in.th/images/2023/08/03/MV7I2t.png" alt="Logo" className="logo-sidebar" roundedCircle />
                            </div>
                            <div className="white-text">
                                <h3 className="d-flex justify-content-center align-items-center ">
                                    <b>System Management</b>
                                </h3>
                            </div>
                            <Nav.Link as={Link} to="/home" className={isActive === 1 ? 'nav-link-active' : 'sidebar-menu'}>หน้าแรก</Nav.Link>
                            <Nav.Link as={Link} to="/assessment" className={isActive === 2 ? 'nav-link-active' : 'sidebar-menu'}>แบบประเมิน</Nav.Link>
                            <Nav.Link as={Link} to="/aptitude" className={isActive === 3 ? 'nav-link-active' : 'sidebar-menu'}>ความถนัด</Nav.Link>
                            <Nav.Link as={Link} to="/ranking" className={isActive === 4 ? 'nav-link-active' : 'sidebar-menu'}>การจัดอันดับ</Nav.Link>
                            <Nav.Link as={Link} to="/course" className={isActive === 5 ? 'nav-link-active' : 'sidebar-menu'}>หลักสูตร</Nav.Link>
                            <Nav.Link as={Link} to="/faculty" className={isActive === 6 ? 'nav-link-active' : 'sidebar-menu'}>คณะ</Nav.Link>
                            <Nav.Link as={Link} to="/career" className={isActive === 7 ? 'nav-link-active' : 'sidebar-menu'}>อาชีพ</Nav.Link>
                            <Nav.Link as={Link} to="/match_aptitude_career" className={isActive === 8 ? 'nav-link-active' : 'sidebar-menu'}>จับคู่ความถนัด&อาชีพ</Nav.Link>
                            <Nav.Link as={Link} to="/match_career_course" className={isActive === 9 ? 'nav-link-active' : 'sidebar-menu'}>จับคู่อาชีพ&หลักสูตร</Nav.Link>
                        </Nav>
                    </div>
                </div>
            </Col>
        </>
    )

}