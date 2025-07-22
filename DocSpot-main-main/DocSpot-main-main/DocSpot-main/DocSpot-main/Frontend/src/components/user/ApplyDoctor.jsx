import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from '../../api/axiosConfig';

function ApplyDoctor({ userId }) {
   const [doctor, setDoctor] = useState({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      specialization: '',
      experience: '',
      fees: '',
      timings: '',
   });

   const handleTimingChange = (_, timings) => {
      setDoctor({ ...doctor, timings });
   };

   const handleChange = (e) => {
      setDoctor({ ...doctor, [e.target.name]: e.target.value })
   }
   const handleSubmit = async () => {
      
      try {
         // Inside handleSubmit in your React component
const res = await axios.post('/api/user/apply-doctor', { doctor }, { // We don't need to send userId anymore! The middleware handles it.
    headers: {
       Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
         if (res.data.success) {
            message.success(res.data.message)
         }
         else {
            message.error(res.data.message || 'Failed to apply')
         }
      } catch (error) {
         console.log(error)
         if (error.response && error.response.data && error.response.data.message) {
           message.error(error.response.data.message)
         } else {
           message.error('Something went wrong')
         }
      }
   };

   return (
      <Container>
         <h2 className='text-center p-3'>Apply for Doctor</h2>
         <Form onFinish={handleSubmit} className='m-3'>
            <h4>Personal Details:</h4>
            <Row gutter={20}>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Full Name" required>
                     <Input name='fullName' value={doctor.fullName} onChange={handleChange} placeholder='Enter name' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Phone" required>
                     <Input value={doctor.phone} onChange={handleChange} name='phone' type='number' placeholder='Your phone' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Email" required>
                     <Input value={doctor.email} onChange={handleChange} name='email' type='email' placeholder='Your email' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Address" required>
                     <Input value={doctor.address} onChange={handleChange} name='address' type='text' placeholder='Your address' />
                  </Form.Item>
               </Col>
            </Row>
            <h4>Professional Details:</h4>
            <Row gutter={20}>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Specialization" required>
                     <Input value={doctor.specialization} onChange={handleChange} type='text' name='specialization' placeholder='Your specialization' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Experience" required>
                     <Input value={doctor.experience} onChange={handleChange} type='number' name='experience' placeholder='Your experience' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Fees" required>
                     <Input value={doctor.fees} onChange={handleChange} name='fees' type='number' placeholder='Your fees' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Timings" name="timings" required>
                     <TimePicker.RangePicker format="HH:mm" onChange={handleTimingChange} />
                  </Form.Item>
               </Col>
            </Row>
            <div className="d-flex justify-content-end">
               <button className="btn btn-primary" type="submit">Submit</button>
            </div>
         </Form>
      </Container>
   );
}

export default ApplyDoctor;
