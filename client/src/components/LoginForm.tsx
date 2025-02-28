import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations.js';
import Auth from '../utils/auth.js';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Use Apollo's `useMutation` hook instead of REST API
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });
      // console.log("Logged in User: ", data);

      Auth.login(data.login.token);
    } catch (err) {
      setShowAlert(true);
    }

    setUserFormData({ email: '', password: '' });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      {/* Show alert if error */}
      {showAlert && <Alert variant="danger">Invalid email or password!</Alert>}

      <Form.Group>
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Your email"
          name="email"
          value={userFormData.email}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your password"
          name="password"
          value={userFormData.password}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Button disabled={!(userFormData.email && userFormData.password)} type="submit" variant="success">
        Login
      </Button>

      {error && <p className="text-danger mt-2">Login failed. Please try again.</p>}
    </Form>
  );
};

export default LoginForm;
