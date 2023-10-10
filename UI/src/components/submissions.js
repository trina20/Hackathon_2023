import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { InputGroup, Row } from 'react-bootstrap';

import {Col} from 'react-bootstrap';


import Table from 'react-bootstrap/Table';

function Submissions() {
    const allEntries = JSON.parse(localStorage.getItem("allEntries"));
    const [displayDetail, setDisplay] = useState(false);
    const [singleEntry, setSingleEntry] = useState({'name': '', 'email': '','feedback': ''})
    

    useEffect(() => {
        var id,entry;
        if (!window.location.pathname.includes('submissions')){
            setDisplay(true)
            id = window.location.pathname.split('/').pop()
            entry = allEntries.filter(item => parseInt(item['id']) === parseInt(id))[0]
            // console.log(entry)
            setSingleEntry(entry)
        }
    },[]);

    const singleEntryForm = ()=>{
        return(
            <Container>
                <Card>
                    <Card.Header>
                        <cite title="Source Title">Feedback Details
                        </cite>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>Type of Feedback</Col>
                            <Col>{singleEntry['type']}</Col>
                        </Row>
                        <Row>
                            <Col>Enquiry on</Col>
                            <Col>{singleEntry['enquiry']}</Col>
                        </Row>
                        <Row>
                            <Col>Customer Name</Col>
                            <Col>{singleEntry['name']}</Col>
                        </Row>
                        <Row>
                            <Col>Email</Col>
                            <Col>{singleEntry['email']}</Col>
                        </Row>
                        <Row>
                            <Col>Staff served</Col>
                            <Col>{singleEntry['staff']}</Col>
                        </Row>
                        <Row>
                            <Col>Branch Visited</Col>
                            <Col>{singleEntry['branch']}</Col>
                        </Row>
                        <Row>
                            <Col>Feedback</Col>
                            <Col>{singleEntry['feedback']}</Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
    
    
    return (
        <>
        {displayDetail?
            (singleEntryForm())
            :
            (<div className='padding30px'>
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>Form Details</th>
                            <th>Type of feedback</th>
                            <th>Enquiry on</th>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Staff Served</th>
                            <th>Branch Visited</th>
                            <th>Feedback</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {allEntries.map(entry=>(
                            <tr>
                                <td><a href={`/submission/${entry['id']}`} target="_blank" rel="noopener noreferrer">View Details</a></td>
                                <td>{entry['type']}</td>
                                <td>{entry['enquiry']}</td>
                                <td>{entry['name']}</td>
                                <td>{entry['email']}</td>
                                <td>{entry['staff']}</td>
                                <td>{entry['branch']}</td>
                                <td>{entry['feedback']}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>)
        }
        </>
    );
}

export default Submissions;