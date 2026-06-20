import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquare, Eye } from "lucide-react";
import { Patient } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export default function PatientTable({ patients, onSelectPatient }: PatientTableProps) {
  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return "bg-green-500";
    if (rate >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAdherenceVariant = (rate: number): "default" | "secondary" | "destructive" => {
    if (rate >= 90) return "default";
    if (rate >= 75) return "secondary";
    return "destructive";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>Medications</TableHead>
            <TableHead>Adherence Rate</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>
                <Badge variant="outline">{patient.bloodType}</Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {patient.medications.slice(0, 2).map((med) => (
                    <div key={med.id} className="text-sm">
                      {med.name} - {med.dosage}
                    </div>
                  ))}
                  {patient.medications.length > 2 && (
                    <div className="text-sm text-gray-500">
                      +{patient.medications.length - 2} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getAdherenceColor(
                        patient.adherenceRate
                      )}`}
                      style={{ width: `${patient.adherenceRate}%` }}
                    />
                  </div>
                  <Badge variant={getAdherenceVariant(patient.adherenceRate)}>
                    {patient.adherenceRate}%
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{patient.name}</DialogTitle>
                        <DialogDescription>Patient Details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p>{patient.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p>{patient.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Age</p>
                            <p>{patient.age} years</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Gender</p>
                            <p>{patient.gender}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Blood Type</p>
                            <p>{patient.bloodType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Adherence</p>
                            <p>{patient.adherenceRate}%</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Medical History</p>
                          <p className="text-sm bg-gray-50 p-3 rounded">{patient.medicalHistory}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Medications</p>
                          <div className="space-y-2">
                            {patient.medications.map((med) => (
                              <div key={med.id} className="flex items-center gap-3 p-2 border rounded">
                                <img src={med.imageUrl} alt={med.name} className="w-12 h-12 rounded object-cover" />
                                <div className="flex-1">
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onSelectPatient(patient)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
