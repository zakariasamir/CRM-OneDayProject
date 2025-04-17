import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLeads, updateMyLead } from "@/redux/slices/managerSlice";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"];

const ManagerLeads = () => {
  const dispatch = useDispatch();
  const { leads, status } = useSelector((state) => state.manager);

  useEffect(() => {
    dispatch(fetchMyLeads());
  }, [dispatch]);

  const handleStatusChange = (leadId, newStatus) => {
    dispatch(updateMyLead({ leadId, status: newStatus }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Leads</h2>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.contactName}</TableCell>
                <TableCell>{lead.companyName}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={lead.status}
                    onValueChange={(value) =>
                      handleStatusChange(lead._id, value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      {lead.status}
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ManagerLeads;
