import React from "react";
import styled from "styled-components";
import { Table as BTable } from "react-bootstrap";

interface TableProps {
  columns: [];
  data: [];
  children?: React.ReactNode;
}

function Table({ columns, data, children }: TableProps) {
  return (
    <BTable striped bordered hover size="lg">
      <thead>
        <tr className="w-44">
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, email, phone }) => (
          <TableRow key={name + email + phone}>
            <td>{name}</td>
            <td>{email}</td>
            <td>{phone}</td>
          </TableRow>
        ))}
      </tbody>
    </BTable>
  );
}

const TableRow = styled.div`
  width: 100%;
  height: 5rem;
`;
export default Table;
