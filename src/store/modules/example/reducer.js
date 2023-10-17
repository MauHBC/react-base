import * as types from "../types";

const initialState = {
  botaoClicado: false,
};

// eslint-disable-next-line default-param-last, func-names
export default function (state = initialState, action) {
  switch (action.type) {
    case types.BOTAO_CLICADO_SUCCESS: {
      console.log("Sucesso");
      const newState = { ...state };
      newState.botaoClicado = !newState.botaoClicado;
      return newState;
    }

    case types.BOTAO_CLICADO_REQUEST: {
      console.log("Fazendo requisição");
      return state;
    }

    case types.BOTAO_CLICADO_FAILURE: {
      console.log("Failure: Error");
      return state;
    }

    default:
      return state;
  }
}
