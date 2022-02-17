import styled from "styled-components";
import axios from "axios";
import { useState } from "react";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;

`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;


const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const Register = () => {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await axios.post("/auth/register", {
        email,
        password,
        username
      });

      res.data && window.location.replace("/verify-user");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          
          <Input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
          <Input placeholder="password" onChange={(e) => setPassword(e.target.value)}/>

          <Button onClick={handleSubmit}>CREATE</Button>
          <p>Otp will be sent to the email</p>
          {error && <span style={{color:"red", marginTop:"10px"}}>Something went wrong!</span>}
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
