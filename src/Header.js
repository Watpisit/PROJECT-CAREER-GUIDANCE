import './NavbarSidebar.css'
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import { useNavigate ,Link} from 'react-router-dom';

export default function Header() {
    const [fullname, setFullname] = useState("");
    const navigate = useNavigate();

    useEffect(() => {    
        const getUser = async () => {
            const response = await fetch(
                "http://localhost:8080/api/get_user",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    }
                }
            );
            const user = await response.json();
            setFullname(user.data[4]);
        }
        getUser();
    }, []);


    const handleLogout = () => {
        navigate("/", { replace: true })  //replace: true เพื่อเปลี่ยน URL และป้องกันการกดปุ่มย้อนกลับไปยังหน้าแรก
    };





    return (
        <>



            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='navbar'>
                
                    {/* 1.พื้นหลังสีดำ bg=dark และใช้ตัวอักษรสีขาว variant=dark
 2.collapseOnSelect: เมื่อกำหนดค่าเป็น true แล้ว Navbar จะถูกยุบเป็น สามขีดด้านข้าง (collapse) 
 เมื่อมีการเลือก (select) เมนูใน Navbar บนอุปกรณ์แบบเล็ก เช่น มือถือ
3.expand="lg": Navbar จะขยาย (expand) เมื่ออยู่ในหน้าจอขนาดใหญ่ (large) 
sm: ระบุว่า Navbar จะขยาย (expand) ในหน้าจอขนาดเล็ก (small) เช่นมือถือ ขนาดปกติ (เหมือนกับไม่ระบุเลย)
md: ระบุว่า Navbar จะขยาย (expand) ในหน้าจอขนาดกลาง (medium) เช่นแท็บเล็ตหรือหน้าจอคอมพิวเตอร์ 
lg: ระบุว่า Navbar จะขยาย (expand) ในหน้าจอขนาดใหญ่ (large) เช่นแท็บเล็ตหรือหน้าจอคอมพิวเตอร์ 
xl: ระบุว่า Navbar จะขยาย (expand) ในหน้าจอขนาดใหญ่กว่ามาตรฐาน เช่นหน้าจอคอมพิวเตอร์ขนาดใหญ่กว่าปกติ 
xxl: ระบุว่า Navbar จะขยาย (expand) ในหน้าจอขนาดใหญ่มาก (extra large) เช่นหน้าจอคอมพิวเตอร์ขนาดใหญ่มาก */}
                    <div className='div-nav'>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        {/* 1. Navbar.Toggleในการสร้างปุ่มเพื่อเปิด/ปิดเมนูนำทางใน Navbar ในเวอร์ชัน Responsive. 
2. aria-controls คือ attribute ที่ระบุไว้ใน <Navbar.Toggle> เพื่อระบุ ID ของเมนูที่ต้องการเปิด/ปิดเมื่อกดปุ่ม Toggle. 
ในที่นี้ค่าที่กำหนดให้เป็น "responsive-navbar-nav" เพื่อให้เป็นค่าอ้างอิงไปยัง <Navbar.Collapse> ที่ต้องการเปิด/ปิดเมื่อมีการกดปุ่ม Toggle*/}
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto" > {/* mr menu left , ms menu right , me center*/}
                                <NavDropdown title={fullname} id="collasible-nav-dropdown">
                                    <Link to={`/profile`}>
                                    <NavDropdown.Item href="/profile">ข้อมูลส่วนตัว</NavDropdown.Item>
                                    </Link>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        ออกจากระบบ
                                    </NavDropdown.Item>
                                </NavDropdown>

                                  <Navbar.Brand >
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/2206/2206248.png"
                                        style={{
                                            width: '50px', height: '50px',
                                            position: 'absolute', right: '20px', top: '13px'
                                        }}
                                        alt="Logo"
                                    /></Navbar.Brand>
                               
                            </Nav>
                    
                        </Navbar.Collapse>
                    </div>
     
            </Navbar>
        </>
    )
}