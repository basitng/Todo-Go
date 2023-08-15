import { format, parseISO } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import { SeverityPill } from "../../components/severity-pill";
import Link from "next/link";

const statusMap = {
  pending: "warning",
  completed: "success",
};

export const OverviewLatestTodos = (props) => {
  const { todos = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Recent Todos" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Todo</TableCell>
                <TableCell>Note</TableCell>
                <TableCell sortDirection="desc">Date Created</TableCell>
                <TableCell sortDirection="desc">Latest Update</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo) => {
                const createdAt = format(
                  parseISO(todo.createdAt),
                  "dd/MM/yyyy"
                );
                const updatedAt = format(
                  parseISO(todo.updatedAt),
                  "dd/MM/yyyy"
                );
                return (
                  <TableRow hover key={todo.id}>
                    <TableCell>{todo.todo}</TableCell>
                    <TableCell>{todo.note}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <SeverityPill
                        color={
                          statusMap[todo.completed ? "completed" : "pending"]
                        }
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Link href="/account">
          <Button
            color="inherit"
            endIcon={
              <SvgIcon fontSize="small">
                <ArrowRightIcon />
              </SvgIcon>
            }
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

OverviewLatestTodos.prototype = {
  todos: PropTypes.array,
  sx: PropTypes.object,
};
