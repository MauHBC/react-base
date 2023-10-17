import React, { useEffect, useState } from "react";
import { get } from "lodash";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { isEmail, isInt, isFloat } from "validator";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as actions from "../../store/modules/auth/actions";

import axios from "../../services/axios";
import history from "../../services/history";
import { Container } from "../../styles/GlobalStyles";
import { Form, ProfilePicture, Title } from "./styled";
import Loading from "../../components/Loading";

export default function Aluno({ match }) {
  const dispatch = useDispatch();

  const id = get(match, "params.id", "");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foto, setFoto] = useState("");

  // to fill form with the data
  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        if (data.Fotos.length > 0) {
          setFoto(data.Fotos[data.Fotos.length - 1].url);
        } else {
          setFoto("");
        }
        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, "response.status", 0);
        const errors = get(err, "response.data.erros", []);

        if (status === 400) errors.map((error) => toast.error(error));
        history.push("/");
      }
    }

    getData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error("Nome deve ter entre 3 e 255 caracteres");
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors = true;
      toast.error("Sobrenome deve ter entre 3 e 255 caracteres");
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error("Email inválido");
    }

    if (!isInt(String(idade))) {
      formErrors = true;
      toast.error("Idade inválida");
    }

    if (!isFloat(String(peso))) {
      formErrors = true;
      toast.error("Peso inválido");
    }

    if (!isFloat(String(altura))) {
      formErrors = true;
      toast.error("Altura inválida");
    }

    setIsLoading(false);
    if (formErrors) return;

    try {
      setIsLoading(true);

      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success("Aluno(a) editado(a) com sucesso");
      } else {
        const { data } = await axios.post(`/alunos/`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success("Aluno(a) criado(a) com sucesso");
        history.push(`/aluno/${data.id}/edit`);
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      const status = get(err, "response.status", 0);
      const data = get(err, "response.data", {});
      const errors = get(data, "errors", []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error("Erro desconhecido");
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading}>Carregando...</Loading>

      <Title>{id ? `Editar Aluno ${id}` : "Novo Aluno"}</Title>

      {id && (
        <ProfilePicture>
          {foto ? (
            <img src={foto} alt={nome} crossOrigin="" />
          ) : (
            <FaUserCircle size={180} />
          )}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="Sobrenome"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
        />
        <input
          type="text"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Peso"
        />
        <input
          type="text"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Altura"
        />

        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
