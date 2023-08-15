import { useCallback, useMemo, useState, useEffect, useReducer } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { UserTodosTable } from "../sections/customer/todo-table";
import { SITE_TITLE } from "../constant/site";
import TodoModal from "../components/todo-modal";

const now = new Date();

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reducerValue, forUpdate] = useReducer((x) => x + 1, 0);

  const handleOpenModal = () => {
    forUpdate();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Todos | {SITE_TITLE}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <TodoModal open={modalOpen} onClose={handleCloseModal} />
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Todos</Typography>{" "}
                {/* Change the heading */}
              </Stack>
              <div>
                <Button
                  onClick={handleOpenModal}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <UserTodosTable />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
