import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";

export default ({ order, orderBy, columns, onSortHandler = () => {} }) => {
  const onClickHandler = (property) => (event) =>
    onSortHandler(event, property);

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => {
          return (
            <TableCell
              key={column.id}
              align={"center"}
              padding={column.disablePadding ? "none" : "default"}
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title={order ? "Sort" : ""}
                placement={"bottom-start"}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={onClickHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
};
