import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads } from "../../redux/slices/employerSlice";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/UI/Table";

const statusColors = {
  PENDING: "text-yellow-600",
  IN_PROGRESS: "text-blue-600",
  COMPLETED: "text-green-600",
  CANCELED: "text-red-600",
};

const EmployerLeads = () => {
  const dispatch = useDispatch();
  const { leads, status } = useSelector((state) => state.employer);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Leads</h2>
      {status === "loading" ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-medium">Contact</TableCell>
              <TableCell className="font-medium">Company</TableCell>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell className="font-medium">Manager</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>
                  <div className="font-medium">{lead.contactName}</div>
                  <div className="text-sm text-gray-500">{lead.contactEmail}</div>
                </TableCell>
                <TableCell>{lead.companyName}</TableCell>
                <TableCell>
                  <span className={statusColors[lead.status]}>{lead.status}</span>
                </TableCell>
                <TableCell>{lead.manager?.name || "Unassigned"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default EmployerLeads;
