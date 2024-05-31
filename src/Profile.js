import Header from './Header';
import Navbar from './Navbar';
import {Container, Row, Col } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './Profile.css'
import { Link } from 'react-router-dom';

export default function Profile() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState(""); 
    const [showPassword, setShowPassword] = useState(false);
    const [userID, setUserID] = useState("");

    useEffect(() => {    //พน.ทำ api เรียกข้อมูลผู้ใช้เอาข้อมูลไป set ไว้ใน useState แล้วไปใส่ตัวแปรใน title ชื่อมุมขวาเว็บ
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
            console.log(user);
            setUserID(user.data[0])
            setUsername(user.data[2]);
            setPassword(user.data[3]);
            setFullname(user.data[4]);
        }
        getUser();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (

        <>
            <Header />

            <Container fluid>
                <Row className='row-content-profile'>
                    <Navbar />

                    <Col sm={9} md={10} className='col-content-profile' >
                        <div className='div-content-profile' >
                            <div className='profile-home'>
                                <img src="https://png.pngtree.com/png-vector/20190930/ourlarge/pngtree-person-icon-isolated-on-abstract-background-png-image_1758778.jpg"
                                    alt="Profile" className='logo-profile' />
                                <div className='text-profile'>
                                    ข้อมูลส่วนตัว
                                </div>
                            </div>

                            <div className='bg-profile'>
                                <div className='text-detail'>
                                    <pre>
                                        Fullname : {fullname}  <br></br>
                                        Username : {username}  <br></br>
                                        Password : {showPassword ? password : '*'.repeat(password.length)} <img
                                            src={showPassword ? 'https://cdn-icons-png.flaticon.com/128/709/709612.png' : 'https://cdn-icons-png.flaticon.com/128/2767/2767146.png'}
                                            alt={showPassword ? 'Hide Password' : 'Show Password'}
                                            onClick={togglePasswordVisibility}
                                            className='img-eye'
                                        />
                                    </pre>
                                    {/* true จะแสดงรหัสผ่านตามปกติ ถ้า showPassword เป็น false 
                                    เราจะใช้ '*'.repeat(password.length) เพื่อแทนที่รหัสผ่านด้วยเครื่องหมายดอกจันที่มีความยาวเท่ากับรหัสผ่าน เพื่อซ่อนรหัสผ่าน                                   */}


                                    <div className='div-edit'>
                                        <Link to={`/edit_profile/${userID}`}>
                                            <img className='img-edit'
                                                src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                                alt='edit'
                                            ></img>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Col>
                </Row>
            </Container>



        </>
    )
}