import { call, put, all, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { get } from "lodash";
import * as actions from "./actions";
import * as types from "../types";
import axios from "../../../services/axios";
import history from "../../../services/history";

// Login in Saga, if success, send login_success data to reducer.
function* loginRequest({ payload }) {
  // console.log("SAGA loginRequest", payload);
  try {
    // sending payload to backend, this return a token.
    const response = yield call(axios.post, "/tokens", payload);
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success("Você fez login");

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    history.push(payload.prevPath);
  } catch (e) {
    console.log(e);
    toast.error("Usuário ou senha inválidos");

    yield put(actions.loginFailure());
  }
}

// function to config auth head with token
function persistRehydrate({ payload }) {
  const token = get(payload, "auth.token", "");
  if (!token) return;
  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

// eslint-disable-next-line consistent-return
function* registerRequest({ payload }) {
  const { id, nome, email, password } = payload;
  // console.log(`SAGA registerRequest: ${payload}`);

  try {
    if (id) {
      yield call(axios.put, "/users", {
        email,
        nome,
        password: password || undefined,
      });
      toast.success("Conta alterada com sucesso!");
      yield put(actions.registerUpdatedSuccess({ nome, email, password }));
    } else {
      yield call(axios.post, "/users", {
        email,
        nome,
        password,
      });
      toast.success("Conta Criada com sucesso!");
      yield put(actions.registerCreatedSuccess({ nome, email, password }));
      history.push("/login");
    }
  } catch (e) {
    const errors = get.apply(e, "response.data.errors", []);
    const status = get(e, "response.status", 0);

    if (status === 401) {
      toast.error("Você precisa fazer login novamente.");
      yield put(actions.loginFailure());
      return history.push("/login");
    }

    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
    } else {
      toast.error("Erro desconhecido");
    }

    yield put(actions.registerFailure);
  }
}

// (action listened, cb funcion)
// listen only the last action, prevent many req from user
export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  // keep bearer token after login and page
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);

// if failure, send failure to reducer.
