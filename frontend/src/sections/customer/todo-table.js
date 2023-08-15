import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import instance from "../../utils/axios";
import EditTodoModal from "../../components/todo-edit";
import { useSelection } from "../../hooks/use-selection";
import { SeverityPill } from "../../components/severity-pill";

const TODO_API_URL = "/todos";

const useTodoIds = (todos) => {
  return useMemo(() => {
    return todos.map((todo) => todo.id);
  }, [todos]);
};

export const UserTodosTable = (props) => {
  const [todos, setTodos] = useState([]);
  const [edited, setEdited] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const todoIds = useTodoIds(todos);
  const todoSelection = useSelection(todoIds);
  const [reducerValue, forCEUpdate] = useReducer((x) => x + 1, 0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const statusMap = {
    pending: "warning",
    completed: "success",
  };

  const handleDelete = async (todo_id) => {
    try {
      await instance.delete(`/todos/${todo_id}`);
      forCEUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenEditModal = useCallback((todo) => {
    setTodoToEdit(todo);
    setEditModalOpen(true);
  }, []);

  const handleCloseEditModal = () => {
    forCEUpdate(true);
    setEditModalOpen(false);
    setTodoToEdit(null);
  };

  const handleSaveEditedTodo = async (editedTodo) => {
    try {
      const newTodos = await instance.put(
        `/todos/${editedTodo.id}`,
        editedTodo
      );

      setTodos((oldTodos) =>
        oldTodos.map((todo) => (todo.id === newTodos.id ? newTodos : todo))
      );
      setEditModalOpen(false);
    } catch (error) {
      throw new Error("Error saving edited todo:", error);
    }
  };
  useEffect(() => {
    const fetchDataAndToggleEdited = async () => {
      const fetchData = async () => {
        try {
          const response = await instance.get(TODO_API_URL);
          setTodos(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
      setEdited((prevEdited) => !prevEdited);
    };

    fetchDataAndToggleEdited();
  }, [reducerValue]);
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <EditTodoModal
            open={editModalOpen}
            onClose={handleCloseEditModal}
            onSave={handleSaveEditedTodo}
            todoToEdit={todoToEdit}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Todo</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Edit</TableCell>
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
                    <TableCell>
                      <Typography variant="subtitle2">{todo.todo}</Typography>
                    </TableCell>
                    <TableCell>{todo.noted}</TableCell>
                    <TableCell>
                      <SeverityPill
                        color={
                          statusMap[todo.completed ? "completed" : "pending"]
                        }
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(todo.id)}
                        aria-label="Delete"
                        color="error"
                      >
                        <SvgIcon>
                          <TrashIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenEditModal(todo)}
                        aria-label="Edit"
                        color="primary"
                      >
                        <SvgIcon>
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
