import Header from './Header';
import Navbar from './Navbar';
import { Container, Row, Col, Table} from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import './MenuRanking.css'
import { Link, useParams } from 'react-router-dom';

export default function MenuRankingDetails() {

    const isActive = 4;
    let params = useParams();

    const [rankingAll, setRankingAll] = useState([]);
    const [rankingYears, setRankingYears] = useState([]);
    const [editYear, setEditYear] = useState('');
    const [sumPercent, setSumpersent] = useState(0);

    useEffect(() => {
        const getRanking = async () => {
            const response = await fetch(
                "http://localhost:8080/api/get_Ranking",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    }
                }
            );
            const ranking = await response.json();
            setRankingAll(ranking.data);
            setEditYear(params.years);
        }

        getRanking();
    }, [params.years]);

    useEffect(() => {
        const rankingAll1 = rankingAll.filter(item => item.years === editYear.toString());
        setRankingYears(rankingAll1);
        let sumPercent1=0;
        for (let i = 0; i < rankingYears.length; i++) {
            const percentFloat = parseFloat(rankingYears[i].percent);
            sumPercent1 += percentFloat;
            setSumpersent(sumPercent1);
        }
        
        
    }, [editYear, rankingAll,sumPercent,params.years,rankingYears]);




    return (
        <>
            <Header />


            <Container fluid >
                <Row className='row-content-ranking-add'>
                    {/* edit class row col divranking */}
                    <Navbar isActive={isActive} />

                    <Col sm={9} md={10} className='col-content-ranking' >
                        <div className='div-content-ranking'>

                            <div className='header-ranking-add'>
                                <img
                                    src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                    alt='edit'
                                    className='img-logoedit'
                                >
                                </img>
                                <div className='text-ranking'>แก้ไขการจัดอันดับ 10 อาชีพปี {editYear} </div>
                            </div>




                            <div className='div-table-add'>
                                <Table striped bordered hover className='table'>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>
                                                อันดับ
                                            </th >
                                            <th className='text-center'>
                                                อาชีพ
                                            </th>

                                            <th className='text-center'>
                                                เปอร์เซ็นต์
                                            </th>
                                            <th className='text-center'>
                                                แก้ไข
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankingYears.map((item, idx) => (

                                            <tr key={item.careerRankingID}>
                                                <td className='text-center'>
                                                    {item.rank}
                                                </td>
                                                <td className='text-center'>
                                                    {item.career}
                                                </td>
                                                <td className='text-center'>
                                                    {item.percent}
                                                </td>
                                                <td className='d-flex justify-content-center'>
                                                    <Link to={`/ranking/update/${editYear}/${item.careerRankingID}`}>
                                                        <img
                                                            src='https://cdn-icons-png.flaticon.com/128/942/942748.png'
                                                            alt='edit'
                                                        />
                                                    </Link>

                                                </td>
                                            </tr>
                                        ))
                                        }
                                        <tr>
                                            <td className='text-center'>เปอร์เซ็นรวม</td>
                                            <td></td>
                                            <td className='text-center'>
                                                {sumPercent}
                                            </td>
                                            <td></td>
                                        </tr>

                                    </tbody>
                                </Table>
                            </div>



                            <div className='logo-Back'>
                                <Link to={`/ranking`} >
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/128/981/981150.png'
                                        alt='back'
                                    />
                                </Link>
                                <div>ย้อนกลับ</div>
                            </div>






                        </div>
                    </Col>
                </Row>

            </Container>

        </>
    )
}