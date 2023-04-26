import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

export default function SigninScreen() {
  const navigate = useNavigate();

  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Submitted: Email=${email}`);
    localStorage.setItem("user", [email, pass]);
    navigate("/payment");
  };
  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className='my-4'>Sign In to your Gamezoo Account</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-4' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            required
            onChange={(e) => setPass(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <div className='mb-3'>
          <Button type='submit'>Sign In</Button>
        </div>
      </Form>
    </Container>
  );
}
