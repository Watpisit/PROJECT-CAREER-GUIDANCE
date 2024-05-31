import { Link } from "react-router-dom";
import { Button, Form, Container, Header, Table } from 'semantic-ui-react';
import React,{ useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  return(
  <>

<li href="#">เมนูหลัก</li>
			<li href="#">เกี่ยวกับเรา</li>
			<li href="#">สินค้า</li>
					<li href="#">เสื้อผ้าา</li>
					<li href="#">รองเท้า</li>
					<li href="#">กระเป๋า</li>

  </>)
/*
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [gender, setGender] = useState('');
  const [data, setData] = useState('');

  const userData = {first_name : firstname, lastname: lastname, gender: gender}

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(firstname, lastname, gender);
    axios.post('https://sheet.best/api/sheets/e88067e6-467f-4e2e-8a8a-a22e9ce9fc4e',userData )
      .then(res => {
        console.log(res);
        alert('Successfully');
      });
    setFirstname('');
    setLastname('');
    setGender('');
  }

  useEffect( () => {
    axios.get('https://sheet.best/api/sheets/e88067e6-467f-4e2e-8a8a-a22e9ce9fc4e/tabs/users')
    .then(res => setData(res))
  }, []);

  if(!data){
    return <div/>;
  }
  console.log(data);

  const deleteHandler = async (Index) => {
    try {
      const res = await fetch(
        `https://sheet.best/api/sheets/e88067e6-467f-4e2e-8a8a-a22e9ce9fc4e/tabs/users/${Index}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


  return (
    
    <Container className='container'>
      <br></br>
      <Header as='h2'>
        Career Guidance
        <br></br>
        <h3>เพิ่มข้อมูล</h3>
      </Header>
      <Form className='form' onSubmit={submitHandler}>
        <Form.Field>
          <label htmlFor='fitstname'>First name</label>
          <input type='text' value={firstname} placeholder='Enter firstname' onChange={(e) => setFirstname(e.target.value)}></input>
        </Form.Field>
        <Form.Field>
          <label htmlFor='lastname'>Last name</label>
          <input type='text' value={lastname} placeholder='Enter lastname' onChange={(e) => setLastname(e.target.value)}></input>
        </Form.Field>
        <Form.Field>
          <label htmlFor='gender'>Gender</label>
          <input type='text' value={gender} placeholder='Enter gender' onChange={(e) => setGender(e.target.value)}></input>
        </Form.Field>

        <Button color='blue' type='submit'>Submit</Button>
      </Form>

    <br></br>
    
    <Table celled>
       <Table.Header>
       <Table.HeaderCell>Index</Table.HeaderCell>
        <Table.HeaderCell>UserID</Table.HeaderCell>
        <Table.HeaderCell>Firstname</Table.HeaderCell>
        <Table.HeaderCell>Lastnaem</Table.HeaderCell>
        <Table.HeaderCell>Gender</Table.HeaderCell>
        <Table.HeaderCell>Birthday</Table.HeaderCell>
        <Table.HeaderCell>Email</Table.HeaderCell>
        <Table.HeaderCell>Password</Table.HeaderCell>
        <Table.HeaderCell>Edit</Table.HeaderCell>
        <Table.HeaderCell>Delete</Table.HeaderCell>
      </Table.Header>

      <Table.Body>
        {data.data.map((val, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>{idx}</Table.Cell>
            <Table.Cell>{val.user_id}</Table.Cell>
            <Table.Cell>{val.first_name}</Table.Cell>
            <Table.Cell>{val.lastname}</Table.Cell>
            <Table.Cell>{val.gender}</Table.Cell>
            <Table.Cell>{val.birthday}</Table.Cell>
            <Table.Cell>{val.user_email}</Table.Cell>
            <Table.Cell>{val.user_pwd}</Table.Cell>
            <Table.Cell> <Link to={`/edit/${idx}`}><Button color='yellow' >แก้ไข </Button></Link> </Table.Cell>
            <Table.Cell><Button color='red' onClick={() => deleteHandler(idx)}>ลบ</Button></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
        
    </Container>

  );
  */
}

export default App;
