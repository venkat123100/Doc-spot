// src/components/common/Home.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

/**
 * DoctorCard: A sub-component to display a single doctor's details.
 * It contains the logic for the conditional "Book Appointment" button.
 */
const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();
    
    // Check if a token exists in localStorage. The '!!' converts the result
    // to a true/false boolean, which is a reliable way to check for login status.
    const isLoggedIn = !!localStorage.getItem('token'); 

    /**
     * This function's behavior changes based on the user's login status.
     */
    const handleBookAppointment = () => {
        if (isLoggedIn) {
            // If the user is logged in, proceed with the booking action.
            console.log(`User is logged in. Proceeding to book with Dr. ${doctor.fullName}`);
            // In a future step, this would navigate to the actual booking page:
            // navigate(`/book-appointment/${doctor._id}`);
            alert(`Booking functionality for Dr. ${doctor.fullName} is not yet implemented.`);
        } else {
            // If the user is not logged in, redirect them to the login page.
            console.log('User is not logged in. Redirecting to login page.');
            navigate('/login');
        }
    };

    return (
        <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
                <Card.Title>{doctor.fullName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{doctor.specialization}</Card.Subtitle>
                <hr />
                <Card.Text>
                    <strong>Experience:</strong> {doctor.experience} years
                    <br />
                    <strong>Fees:</strong> ${doctor.fees} per session
                    <br />
                    <strong>Timings:</strong> {doctor.timings?.[0] || 'N/A'} - {doctor.timings?.[1] || 'N/A'}
                </Card.Text>
                
                {/* The button's text and color change based on the login status. */}
                <Button 
                    variant={isLoggedIn ? "primary" : "secondary"} // Blue if logged in, Grey if not
                    className="mt-auto" 
                    onClick={handleBookAppointment}
                >
                    {isLoggedIn ? "Book Appointment" : "Login to Book"}
                </Button>
            </Card.Body>
        </Card>
    );
};

/**
 * Home: The main component for the landing page.
 * It fetches the list of all approved doctors and displays them using DoctorCard.
 */
const UserAppointments= () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This `useEffect` hook runs once when the component is first rendered.
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                setError(null);
                // This is a public API endpoint, so no authentication is required.
                const res = await axios.get('/api/user/get-all-doctors');

                if (res.data.success) {
                    setDoctors(res.data.data);
                } else {
                    throw new Error(res.data.message || "Could not fetch the list of doctors.");
                }
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
                setError(err.message || 'An unknown error occurred. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []); // The empty dependency array `[]` ensures this effect runs only once.

    // This function decides what to show on the screen based on the fetch status.
    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center p-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }

        if (error) {
            return <Alert variant="danger"><strong>Error:</strong> {error}</Alert>;
        }

        if (doctors.length === 0) {
            return (
                <Alert variant="info" className="text-center">
                    <h4>No Doctors Available</h4>
                    <p>There are currently no approved doctors available. Please check back later.</p>
                </Alert>
            );
        }

        return (
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {doctors.map((doctor) => (
                    <Col key={doctor._id}>
                        <DoctorCard doctor={doctor} />
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Container className="py-5">
            <h1 className="text-center mb-5">Find and Book Our Top Doctors</h1>
            {renderContent()}
        </Container>
    );
};

export default UserAppointments;