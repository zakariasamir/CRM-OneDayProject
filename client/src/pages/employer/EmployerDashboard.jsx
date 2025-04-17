import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardStats } from "./redux/slices/employerSlice";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, status } = useSelector((state) => state.employer);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <>
          <Card>
            <CardContent>
              <CardTitle>In Progress</CardTitle>
              <p>{dashboardStats.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CardTitle>Completed</CardTitle>
              <p>{dashboardStats.completed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CardTitle>Canceled</CardTitle>
              <p>{dashboardStats.canceled}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EmployerDashboard;
