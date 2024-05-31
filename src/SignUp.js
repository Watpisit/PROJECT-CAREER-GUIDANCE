import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { useNavigate} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';

function SignUp() {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const [userID, setUserID] = useState(0);
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userAll, setUserAll] = useState([]);
    const [show, setShow] = useState(false);


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ

        } else {
            if (password !== confirmPassword) {
                setShow(true); //จะเรียกใช้ alert 
            } else if (password === confirmPassword) {
                handleRegister();
            }
        }
        setValidated(true);
    }



    const handleRegister = async () => {
        const data = {
            userID: userID,
            fullname: fullname,
            username: username,
            password: password
        };
        await axios.put(`http://localhost:8080/register`, data)   //ถ้า fetch ต้องใช้ bodyแต่ axios ง่ายกว่า
            .then(response => {
                if (response.data.result === true) {
                    navigate("/", { replace: true });
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        const getUser = async () => {
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
            const user = await response.json();
            setUserAll(user.data)
        };
        getUser();
    }, []);

    useEffect(() => {
        setUserID(userAll.length+1)
    }, [userAll]);





    const handleCancel = () => {
        navigate("/", { replace: false });
    };




    return (

        <>
            <div className='position-fixed'>

                <img
                    src='https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg'
                    alt='img'
                    style={{ height: '105vh', width: '100%', position: 'absolute', marginTop: '0', top: '0 ', bottom: '0', marginBottom: '0', opacity: '0.6' }}
                />

                <div className='w-100 d-flex justify-content-center align-items-center mt-5'>
                    <Image
                        src="https://www.pngplay.com/wp-content/uploads/1/Sign-Up-PNG-Free-Commercial-Use-Images.png"
                        fluid
                        className='w-75 position-relative mt-0'
                    />
                </div>

                <Form noValidate validated={validated} onSubmit={handleSubmit} className='m-4' style={{ position: 'absolute' }}>
                    <Row className="mb-3 mt-5">
                        <Form.Group as={Col} md="4" controlId="validationCustom01" className='mb-2'>
                            <Form.Label>Fullname</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter your fullname"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">กรุณาใส่ fullname</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="4" controlId="validationCustom02" className='mb-2'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}

                            />
                            <Form.Control.Feedback type="invalid">กรุณาใส่ username</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="4" controlId="validationCustom03" className='mb-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Enter your password"
                                minLength={10}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">กรุณาใส่ password อย่างน้อย 10 ตัว</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="4" controlId="validationCustom04" className='mb-2'>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Confirm your password"
                                minLength={10}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <Form.Control.Feedback type="invalid">กรุณาใส่ confirm password อย่างน้อย 10 ตัวอักษร</Form.Control.Feedback>
                        </Form.Group>
                        {show && (
                            <Alert className='alert-danger ' variant="danger" onClose={() => setShow(false)} dismissible>
                                โปรดใส่รหัสผ่านให้ถูกต้อง
                            </Alert>
                        )}

                    </Row>


                    <div className='d-flex justify-content-center align-items-center flex-column'>
                        <Button type="submit" size="lg" className='mb-2 mt-5 w-75'>ยืนยันการลงทะเบียน</Button>
                        <Button onClick={handleCancel} variant="secondary" size="lg" className='mb-2 mt-2 w-75'>กลับหน้าล็อคอิน</Button>
                    </div>
                </Form>

            </div>




        </>

    );
}

export default SignUp;