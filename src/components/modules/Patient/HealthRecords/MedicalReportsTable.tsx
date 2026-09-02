"use client";

import { IMedicalReport } from "@/types/patient.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MedicalReportsTableProps {
  reports: IMedicalReport[];
  onRefresh?: () => void;
}

export default function MedicalReportsTable({
  reports,
}: MedicalReportsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getFileType = (link: string): "pdf" | "image" => {
    return link.toLowerCase().endsWith(".pdf") ? "pdf" : "image";
  };

  const getFileIcon = (link: string) => {
    const fileType = getFileType(link);
    return fileType === "pdf" ? (
      <FileText className="h-4 w-4 text-red-500" />
    ) : (
      <ImageIcon className="h-4 w-4 text-blue-500" />
    );
  };

  const getFileTypeLabel = (link: string) => {
    const fileType = getFileType(link);
    return (
      <Badge variant={fileType === "pdf" ? "default" : "secondary"}>
        {fileType.toUpperCase()}
      </Badge>
    );
  };

  if (reports.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-sm font-semibold">No Medical Reports</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No medical reports uploaded yet. Upload your first report to get
            started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Medical Reports</span>
            <Badge variant="outline">
              {sortedReports.length} Report
              {sortedReports.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(report.reportLink)}
                        <div className="flex flex-col gap-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {report.reportName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {report.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getFileTypeLabel(report.reportLink)}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(report.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={report.reportLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" title="View Report">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <a
                          href={report.reportLink}
                          download={report.reportName}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(report.id)}
                          title="Delete Report"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medical Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medical report? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
