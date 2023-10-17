import styled from "styled-components";
import * as colors from "../../config/colors";

export const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 20px;
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 8px;
    margin-top: 5px;

    &:focus {
      border: 1px solid ${colors.primaryColor};
    }

`;
