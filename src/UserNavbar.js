import {  Image } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './User.css'
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function UserNavbar(props) {

   
    const userID = props.userID;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [fullname, setFullname] = useState("");
    const [userAll, setuserAll] = useState([]);
  



    useEffect(() => {
        const getUserAll = async () => {
            const response = await fetch(
                "http://localhost:8080/api/get_userAll",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    }
                }
            );
            const userAll1 = await response.json();
            setuserAll(userAll1.data);
        }
        getUserAll();

    }, []);


    useEffect(() => {
        let userLogin1 = userAll.find(item => item.userID === props.userID.toString());
        setFullname(userLogin1?.fullname);
      }, [userAll,props.userID]);



    return (
        <>
            <div style={{ marginBottom: '20px', padding: '8px', display: 'flex', color: 'white', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '5vh', backgroundColor: 'rgb(27, 61, 109)' }}>
                <Image src="https://cdn-icons-png.flaticon.com/128/7711/7711100.png" className='h-100 ml-5' onClick={handleShow} rounded />
                <div >Career Guidance</div>
                <div style={{ marginRight: '10px' }}></div>
            </div>



            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><h1>เมนู</h1></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='d-flex align-items-center'>
                        <Image src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png" style={{ width: '20%', marginRight: '4%' }} rounded />
                        <p><h2 style={{ color: 'black' }}>{fullname}</h2></p>
                    </div>
                    <br />
                    <div className='d-flex align-items-center box-menu'>
                        <Image src="https://cdn-icons-png.flaticon.com/128/2974/2974222.png" className='user-menu' rounded />
                        <Link to={{ pathname: '/user/assessment/' + userID }} style={{ textDecoration: 'none', color: 'black' }}>
                            <h2>แบบประเมิน</h2>
                        </Link>
                    </div>
                    <br />
                    <div className='d-flex align-items-center box-menu'>
                        <Image src="https://cdn-icons-png.flaticon.com/128/2822/2822687.png" className='user-menu' rounded />
                        <Link to={{ pathname: '/user/history/' + userID }} style={{ textDecoration: 'none', color: 'black' }} >
                            <h2>ประวัติการทำแบบประเมิน</h2>
                        </Link>
                    </div>
                    <br />
                    <div className='d-flex align-items-center box-menu'>
                        <Image src="https://cdn-icons-png.flaticon.com/128/1828/1828490.png" className='user-menu' rounded />
                        <Link to={{ pathname: '/' }} style={{ textDecoration: 'none', color: 'black' }}>
                            {/* textDecoration เส้นสีฟ้าใต้ตัวอักษร ลิ้ง*/}
                            <h2>ออกจากระบบ</h2>
                        </Link>
                    </div>

                </Offcanvas.Body>
            </Offcanvas>


        </>
    )
}