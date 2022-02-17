import styled from "styled-components";
import axios from "axios";
import { useState } from "react";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
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
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await axios.post("/auth/verify-user", {
        email,
        otp
      });
      res.data && window.location.replace("/login");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Verify your ACCOUNT</Title>
        <Form>
          
          <Input placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
          <Input placeholder="otp" onChange={(e) => setOtp(e.target.value)}/>

          <Button onClick={handleSubmit}>Verify</Button>
          {error && <span style={{color:"red", marginTop:"10px"}}>Something went wrong!</span>}
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
