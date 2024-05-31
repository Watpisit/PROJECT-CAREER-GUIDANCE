import { Button, Container, Form} from 'react-bootstrap';
import { useNavigate,  Link } from 'react-router-dom';
import { useState } from "react"
import './Login.css';
import "./User.css";
import Swal from 'sweetalert2';


export default function Login() {

    const navigate = useNavigate(); //ใช้สำหรับเปลี่ยน url ไปยังหน้าที่ต้องการ
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const isSmallScreen = window.innerWidth < 576;



    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); //ป้องกันไม่ให้เกิดการเปลี่ยนหน้าจากการกด submit

        if (form.checkValidity() === false) {
            event.stopPropagation(); //ถ้ากรอกข้อมูลไม่ครบจะไม่ให้เกิดอีเว้นใดๆ
        } else {
            if (password.length >= 10) {
                doLogin();
            } else {
                Swal.fire({
                    text: 'กรุณาใส่รหัสผ่านที่มีความยาวเท่ากับหรือมากกว่า 10 ตัวอักษร',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง'
                });
            }

        }

        setValidated(true);
    }

    const doLogin = async () => {

        const response = await fetch(
            "http://localhost:8080/api/login",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ username: username, password: password })
            }
        );

        const data = await response.json();

        if (data.result) {
            let role = data.data[6]//data.data[6]==1 อเรย์ตำแหน่งที่ 6 คือ role , 1 คือแอดมิน
            if (role.toString() === "1") {
                navigate("home", { replace: false })
                //พารามิเตอร์ replace ในฟังก์ชัน navigate ใช้ในการกำหนดว่าการเปลี่ยนเส้นทาง (navigation) ใหม่จะเป็นการแทนที่ (replace) หรือไม่ 
                //โดยมีค่าเริ่มต้นเป็น false ซึ่งหมายถึงการเพิ่มประวัติการเปลี่ยนเส้นทางใหม่ลงในประวัติการเปลี่ยนเส้นทางของเบราว์เซอร์ (เพิ่มปุ่มย้อนกลับจากหน้าถัดไป)
            } else if (role.toString() === "2") {
                navigate(`/user/assessment/${data.data[0]}`, { replace: false });
            }
        } else {
            Swal.fire({
                title: 'ล็อคอินไม่สำเร็จ',
                text: 'Username หรือ Password ไม่ถูกต้อง',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        }
    }

    return (
        <>

            <div className="maincontainer">
                <div className="container-fluid">
                    <div className="row no-gutter">

                        <div className="col-md-6 d-none d-md-flex bg-image"></div>

                        <div className="col-md-6 bg-light" >
                    

                            <div className="login d-flex align-items-center py-5">

                                <div className={`container ${isSmallScreen ? 'p-5' : ''}`}>
                                    <div className="row">
                                        <div className="col-lg-10 col-xl-7 mx-auto p-4">
                                            <h1 className="display-4">
                                                Login</h1>
                                            <h2 className="display-4">Career Guidance</h2>
                                            <br></br>

                                            {<Container>
                                                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                                                    <Form.Group className="mb-3" controlId="txtUsername">
                                                        <Form.Label>Username</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            required //จำเป็นต้องใส่
                                                            placeholder="Username" //ข้อความในช่องอินพุท
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)} // onChang คือ การเรียกใช้ฟังก์ชันส่งค่าเข้าไป
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาใส่ username
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" controlId="txtPassword">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            required
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาใส่ password
                                                        </Form.Control.Feedback>
                                                   
                                                    </Form.Group>

                                                    <div className="d-grid gap-3 mt-4">
                                                        <Button type="submit" className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Login</Button>
                                                    </div>



                                                    <Link to={`/signup`}>
                                                        <div className="d-grid gap-3 mt-4">
                                                            <Button className="btn btn-success btn-block text-uppercase mb-2 rounded-pill shadow-sm">Sign Up</Button>
                                                        </div>
                                                    </Link>

                                                </Form>
                                            </Container>}

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}