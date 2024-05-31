import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import './EditProfile.css'
import axios from 'axios';

export default function EditProfile() {
    const navigate = useNavigate();
    const [userID, setUserID] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);



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
            setUserID(user.data[0]);
            setUsername(user.data[2]);
            setPassword(user.data[3]);
            setFullname(user.data[4]);
        };
        getUser();
    }, []);


    const handleEditProfile = async () => {
        const data = {
            fullname: fullname,
            username: username,
            password: password
        };
        await axios.put(`http://localhost:8080/edit_profile/${userID}`, data)   //ถ้า fetch ต้องใช้ bodyแต่ axios ง่ายกว่า
            .then(response => {
                if (response.data.result === true) {
                    navigate("/home", { replace: false });
                }
            })
            .catch(error => {
                console.error(error);
            });
    };


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ

        } else {
            if (password !== confirmPassword) {
                setShow(true); //จะเรียกใช้ alert ใน return
                // alert("โปรดใส่รหัสผ่านให้ถูกต้อง");
            } else if (password === confirmPassword) {
                handleEditProfile();
            }
        }
        setValidated(true);
    }


    const handleCancel = () => {
        navigate("/home", { replace: false });
    };


    return (
        <>
            <Header />

            <Container fluid>
                {/* Container เป็นคอมโพเนนต์ที่มีการจัดรูปแบบแบบเต็มหน้าจอและช่วยให้ส่วนอื่น ๆ อยู่ภายในขอบเขตที่กำหนด */}
                <Row className='row-content-editprofile'>
                    <Navbar />

                    <Col sm={9} md={10} className='col-content-editprofile' >
                        <div className='div-content-editprofile' >

                            {show && (
                                <Alert className='alert-danger' variant="danger" onClose={() => setShow(false)} dismissible>
                                    โปรดใส่รหัสผ่านให้ถูกต้อง
                                </Alert>
                            )}

                            <div className='div-editprofile'>
                                <img className='img-edit'
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                ></img>
                                <div className='text-profile'>
                                    แก้ไขข้อมูลส่วนตัว
                                </div>
                            </div>

                            <div className='div-form'>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>Fullname         :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="Enter your fullname"
                                                value={fullname}
                                                onChange={(e) => setFullname(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ fullname
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>Username         :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="Enter your username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ username
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label ><pre className='pre-label'>Password         :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="password"
                                                required
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ password
                                            </Form.Control.Feedback>

                                        </div>
                                    </div>

                                    <div className='div-input'>
                                        <div className='div-label'>
                                            <Form.Label><pre className='pre-label'>Confirm password :</pre></Form.Label>
                                        </div>
                                        <div className='div-form-control'>
                                            <Form.Control
                                                type="password"
                                                required
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาใส่ confirm password
                                            </Form.Control.Feedback>

                                        </div>
                                    </div>

                                    <div className='div-button'>
                                        <Button variant="primary" type="submit" className='button-save'>
                                            บันทึก
                                        </Button>

                                        <Button variant="danger" onClick={handleCancel} className='button-cancel'>
                                            ยกเลิก
                                        </Button>
                                    </div>

                                </Form>
                            </div>



                        </div>

                    </Col>
                </Row>
            </Container>




        </>
    )
}