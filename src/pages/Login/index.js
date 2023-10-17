import React from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import history from "../../services/history";

import { Container } from "../../styles/GlobalStyles";
import { Form } from "./styled";
import * as actions from "../../store/modules/auth/actions";

import Loading from "../../components/Loading";

export default function Login(props) {
  // props => history, location(pathname), rest
  // disparador de ações
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.auth.isLoading);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const prevPatch = get(props, "location.state.prevPath", "/");

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error("Email inválido");
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error("Senha inválida");
    }

    if (formErrors) {
      console.log("Pages-login-index: email ou senha inválidos");
    }

    dispatch(actions.loginRequest({ email, password, prevPatch }));
    history.push("/");
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Login</h1>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
        />
        <button type="submit">Entrar</button>
      </Form>
    </Container>
  );
}
