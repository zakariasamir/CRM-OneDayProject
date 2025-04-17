import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchManagers, deleteManager } from "./redux/slices/employerSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

const EmployerManagers = () => {
  const dispatch = useDispatch();
  const { managers, status } = useSelector((state) => state.employer);

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  const handleDelete = (managerId) => {
    dispatch(deleteManager(managerId));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Managers</h2>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager._id}>
                <TableCell>{manager.name}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDelete(manager._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default EmployerManagers;
