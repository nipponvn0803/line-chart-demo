import styled from "styled-components";

const CustomizeButton = styled.button`
  outline: none;
  border: ${props => (props.primary ? "none" : "1px solid #d82b03")};
  cursor: pointer;
  font-family: Open Sans, sans-serif;
  font-size: ${props => (props.fontSize ? props.fontSize : "14px")};
  font-weight: bold;
  min-width: 165px;
  height: ${props => (props.height ? props.height : "30px")};
  width: ${props => props.width};
  background-color: ${props => (props.primary ? "#02a676" : "#fff")};
  border-radius: ${props => (props.borderRadius ? props.borderRadius : "14px")};
  color: ${props => (props.primary ? "#fff" : "#d82b03")};
  margin-top: 12px;
  padding: 5px 20px;

  &:hover {
    box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
  }
`;

export default CustomizeButton;
