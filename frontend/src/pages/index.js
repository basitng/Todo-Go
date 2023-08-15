import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { TotalTodosOverview } from "../sections/overview/total-todo";
import { OverviewLatestTodos } from "../sections/overview/overview-latest-todos";
import { OverviewLatestProducts } from "../sections/overview/overview-latest-products";
import { TotalPendingTodos } from "../sections/overview/todo-pending";
import { TotalCompletedTodosOverview } from "../sections/overview/todo-completed";
import { TotalItems } from "../sections/overview/total-items";
import { DiscreteAnalysis } from "../sections/overview/discrete-analysis";
import { SITE_TITLE } from "../constant/site";
import { useEffect, useState } from "react";
import instance from "../utils/axios";
import AverageTodosDuration from "../sections/overview/average-todo-duration";

const now = new Date();

const Page = () => {
  const [data, setData] = useState({
    totalTodo: 0,
    completedTodo: 0,
    pendingTodo: 0,
    totalItems: 0,
    todos: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAll = await instance.get("/todos");
        const responseCompleted = await instance.get("/todos/completed");
        const responsePending = await instance.get("/todos/uncompleted");
        const totalItem = await instance.get("/items");
        const todos = await instance.get("/todos");

        const completedTodoCount = responseCompleted.data.length;
        const pendingTodoCount = responsePending.data.length;
        const totalTodoCount = responseAll.data.length;
        const totalItemCount = totalItem.data.length;

        setData({
          totalTodo: totalTodoCount,
          completedTodo: completedTodoCount,
          pendingTodo: pendingTodoCount,
          totalItems: totalItemCount,
          todos,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Overview | {SITE_TITLE}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <TotalTodosOverview
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={data.totalTodo}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <TotalCompletedTodosOverview
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value={data.completedTodo}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <TotalPendingTodos
                sx={{ height: "100%" }}
                value={data.pendingTodo}
                difference={12}
                positive
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <TotalItems sx={{ height: "100%" }} value={data.totalItems} />
            </Grid>
            <Grid xs={12} lg={8}>
              <AverageTodosDuration />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <DiscreteAnalysis
                chartSeries={[
                  data.completedTodo,
                  data.pendingTodo,
                  data.totalItems,
                ]}
                labels={["Completed", "Pending", "Item"]}
                sx={{ height: "100%" }}
              />
            </Grid>

            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestTodos
                todos={data?.todos?.data}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
