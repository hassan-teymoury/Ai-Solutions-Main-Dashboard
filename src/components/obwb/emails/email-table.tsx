"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Email } from "@/types/emails";
import { Clock, Eye, EyeOff, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
interface EmailTableProps {
  emails: Email[];
}

export function EmailTable({ emails }: EmailTableProps) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-20">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow
              key={email.id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => router.push(`/dashboard/emails/${email.id}`)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {email.sender_name || email.sender_email}
                    </span>
                  </div>
                  <div className="max-w-[400px] text-sm text-muted-foreground truncate">
                    {email.sender_email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium line-clamp-1">
                    {email.subject || "(No Subject)"}
                  </div>
                  <div className="max-w-[400px] truncate text-sm text-muted-foreground line-clamp-2">
                    {email.body_preview}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatDate(email.received_date)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {email.is_read ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-blue-500" />
                  )}
                  {!email.is_read && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
