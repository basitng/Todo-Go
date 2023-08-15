import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
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
import EditItemModal from "../../components/item-edit";

const ITEM_API_URL = "/items";

const useItemIds = (items) => {
  return useMemo(() => {
    return items.map((item) => item.id);
  }, [items]);
};

export const UserItemTable = (props) => {
  const [items, setItems] = useState([]);
  const [edited, setEdited] = useState(false);
  const itemIds = useItemIds(items);
  const [reducerValue, forUpdate] = useReducer((x) => x + 1, 0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleDelete = async (item_id) => {
    try {
      await instance.delete(`/items/${item_id}`);
      forUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenEditModal = useCallback((item) => {
    setItemToEdit(item);
    setEditModalOpen(true);
  }, []);

  const handleCloseEditModal = () => {
    forUpdate();
    setEditModalOpen(false);
    setItemToEdit(null);
  };

  const handleSaveEditedTodo = async (editedTodo) => {
    try {
      const newItems = await instance.put(
        `/items/${editedTodo.id}`,
        editedTodo
      );

      setItems((oldItems) =>
        oldItems.map((todo) => (todo.id === newItems.id ? newItems : todo))
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
          const response = await instance.get(ITEM_API_URL);
          setItems(response.data);
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
          <EditItemModal
            open={editModalOpen}
            onClose={handleCloseEditModal}
            onSave={handleSaveEditedTodo}
            itemToEdit={itemToEdit}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Value</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((todo) => {
                return (
                  <TableRow hover key={todo.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{todo.value}</Typography>
                    </TableCell>

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
