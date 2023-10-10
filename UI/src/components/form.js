import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { InputGroup, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {Col} from 'react-bootstrap';
import 'react-phone-number-input/style.css'
import SpeechRecognitionComponent from './speechrecognition';
import Dropdown from 'react-bootstrap/Dropdown';

function FeedbackForm() {
    const [displayform, setDisplay] = useState(true)
    const [em_value, setEmValue] = useState('')
    const [title_value, setTitleValue] = useState('')
    const [fnm_value, setFnmValue] = useState('')
    const [lnm_value, setLnmValue] = useState('')
    const [ph_value, setPhoneValue] = useState('')
    const [feed_value, setFeedValue] = useState('')
    const [staff_value, setStaffValue] = useState('')
    const [branch_value, setBranchValue] = useState('')
    const [type_value, setTypeValue] = useState('')
    const [enq_value, setEnqValue] = useState('')
    const [error_msg, setErrorMsg] = useState('Please enter the value for the above field(s)');


    const validateForm = ()=>{
        setErrorMsg('Please enter the value for the above field(s)');

        [...document.getElementsByClassName('alert-danger')].forEach(element => {
            element.style.display = "none";
        });
        if(fnm_value===''){
            document.getElementById('name_er').style.display = "block";
        }
        else if(em_value===''){
            document.getElementById('email_er').style.display = "block";
        }
        else if(!em_value.includes('.com')||(!em_value.includes('@'))){
            document.getElementById('email_er').style.display = "block";
            setErrorMsg('Invalid Email')
        }
        else if(feed_value===''){
            document.getElementById('feedback_er').style.display = "block";
        }
        else return true;
    };
    
    const formSubmit = (e) =>{
        e.preventDefault();

        if (validateForm())
        {
            var existingEntries = JSON.parse(localStorage.getItem("allEntries"));
            var new_id = 0;
            if(existingEntries == null) existingEntries = [];
            else{
                let lastentry = existingEntries.slice(-1)[0]
                new_id = parseInt(lastentry["id"]) + 1;
            }
            // var entry = {
            //     "id": new_id, 
            //     "type": type_value,
            //     "enquiry": enq_value,
            //     "email": em_value,
            //     "name": nm_value,
            //     "feedback": feed_value,
            //     "staff": staff_value,
            //     "branch": branch_value
            // };
            // // Save allEntries back to local storage
            // existingEntries.push(entry);
            // localStorage.setItem("allEntries", JSON.stringify(existingEntries));
            // setDisplay(false)

            //Start API call
fetch('https://localhost:44385/api/sentiment/customer', {
    method: 'POST',
    body: JSON.stringify({
        FeedbackType: type_value,
        FeedbackOn: enq_value,
        Title: title_value,
        FirstName: fnm_value,
        LastName: lnm_value,
        Email: em_value,
        Phone: ph_value,
        StaffServed: staff_value,
        Branch: branch_value,
        FeedbackText: feed_value,
        UserId: Math.random().toString(36).slice(2)
    }),
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },    
}).then((response) => response.json())
.then((data) => {
    console.log(data);
    setDisplay(false);

}).catch((err) => {
    console.log(err.message);
    setDisplay(false);

})
            //End API call

        }
        
    };
    
    return (
        <Container>
            {displayform ? 
            (<Card style={{background:'bisque'}}>
                <Card.Header>
                    <cite title="Source Title">We are committed to provide you with the best
                        product experience possible, so we welcome your comments.
                    </cite>
                </Card.Header>
                <Card.Body>
                    <blockquote className="blockquote mb-0">
                        Please fill out the feedback form 
                    </blockquote>
                    
                </Card.Body>
                <Container className='padding30px'>
                    <Form>
                                                <Row>
                        <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control style={{background:'coral'}} required type="text" placeholder="E.g. Mr/Mrs" value={title_value} onChange={e => setTitleValue(e.target.value)} />
                                    
                                </Form.Group>
                            </Col>  
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control style={{background:'coral'}} required type="text" placeholder="E.g. John" value={fnm_value} onChange={e => setFnmValue(e.target.value)} />
                                    
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control style={{background:'coral'}} required type="text" placeholder="E.g. Snow" value={lnm_value} onChange={e => setLnmValue(e.target.value)} />
                                    
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Feedback Type</Form.Label>
                                    <Form.Select style={{background:'coral'}} value={type_value} onChange={e => setTypeValue(e.target.value)}  aria-label="Default select example">
                                        <option>Please Select</option>
                                        <option value="Enquiry">Enquiry</option>
                                        <option value="Complaint">Complaint</option>
                                        <option value="Complement">Complement</option>
                                        <option value="Suggestion">Suggestion</option>
                                    </Form.Select>

                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Feedback On</Form.Label>
                                    <Form.Select style={{background:'coral'}} value={enq_value} onChange={e => setEnqValue(e.target.value)} aria-label="Default select example">
                                        <option>Please Select</option>
                                        <option value="Retail Banking">Retail Banking</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Mortgage Loan">Mortgage Loan</option>
                                        {/* <option value="Treasures">Treasures</option>
                                        <option value="Staff code of conduct">Staff code of conduct</option> */}
                                    </Form.Select>

                                </Form.Group>
                            </Col>
                        </Row>
                       

                        <Row>
                        <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control style={{background:'coral'}} type="email" placeholder="E.g. abc@gmail.com" value={em_value} onChange={e => setEmValue(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control style={{background:'coral'}} type="text" placeholder="E.g. (123) 456-7890" value={ph_value} onChange={e => setPhoneValue(e.target.value)}/>
                                </Form.Group>
                            </Col>
                           
                        </Row>
                        <Row>
                        <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Name of the staff who served me</Form.Label>
                                    <Form.Control style={{background:'coral'}} type="text" placeholder="E.g. Ravindra" value={staff_value} onChange={e => setStaffValue(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Branch Visited</Form.Label>
                                    <Form.Control style={{background:'coral'}} type="text" placeholder="E.g. Wells Fargo California" value={branch_value} onChange={e => setBranchValue(e.target.value)}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col><SpeechRecognitionComponent/></Col>
                        </Row> */}
                        
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Please enter your feedback</Form.Label>
                                    <Form.Control style={{background:'coral'}} as="textarea" maxLength={200} rows={3} placeholder="E.g. Please describe your experience" value={feed_value} onChange={e => setFeedValue(e.target.value)}/>                                </Form.Group>
                            </Col>
                        </Row>
                        <Button style={{background:'crimson'}} className='btn_purp' onClick={e=>formSubmit(e)}>Submit Feedback</Button>
                    </Form>
                </Container>
            </Card>
            ):(
                <Card bg='light' text='dark'>
                    <Card.Body>
                        <div  className='padding30px'>
                            <div class="circle">
                            <div class="checkmark"></div>
                            </div>
                        </div>
                        <Card.Text>
                            Thank you for providing the feedback!
                        </Card.Text>
                        <Form.Text muted>
                            We will work towards improving your experience.
                        </Form.Text>
                        <div className='padding30px'>
                            <Button className='btn_purp' onClick={()=>window.location.href='/'}>Close</Button>
                        </div>
                    </Card.Body>
                </Card>
            )}
            
        </Container>        
    );
    
}

export default FeedbackForm;
