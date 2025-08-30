import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2,
  Check,
  X,
  Download,
  Settings,
  MoreHorizontal,
  Trash2,
  Eye,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'date' | 'select' | 'badge' | 'action';
  options?: { value: string; label: string }[];
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface AdvancedDataTableProps {
  data: any[];
  columns: ColumnDefinition[];
  title?: string;
  description?: string;
  onEdit?: (rowId: string, field: string, value: any) => void;
  onDelete?: (rowIds: string[]) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  pageSize?: number;
  enableSelection?: boolean;
  enableInlineEdit?: boolean;
  enableExport?: boolean;
  expandableRows?: boolean;
  renderExpandedRow?: (row: any) => React.ReactNode;
  isLoading?: boolean;
  realTimeUpdates?: boolean;
}

export function AdvancedDataTable({
  data,
  columns,
  title,
  description,
  onEdit,
  onDelete,
  onExport,
  onRefresh,
  pageSize = 10,
  enableSelection = true,
  enableInlineEdit = true,
  enableExport = true,
  expandableRows = false,
  renderExpandedRow,
  isLoading = false,
  realTimeUpdates = false
}: AdvancedDataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.map(col => col.key)));

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle row selection
  const toggleRowSelection = (rowId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  // Handle inline editing
  const startEdit = (rowId: string, field: string, currentValue: any) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingCell && onEdit) {
      onEdit(editingCell.rowId, editingCell.field, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Handle row expansion
  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Render cell content
  const renderCell = (row: any, column: ColumnDefinition) => {
    const value = row[column.key];
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.key;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          {column.type === 'select' ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {column.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={column.type === 'number' ? 'number' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
            />
          )}
          <Button size="sm" variant="ghost" onClick={saveEdit} className="h-8 w-8 p-0">
            <Check className="w-4 h-4 text-success" />
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 w-8 p-0">
            <X className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      );
    }

    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'badge':
        return (
          <Badge 
            variant={value === 'approved' ? 'default' : value === 'pending' ? 'secondary' : 'destructive'}
            className="capitalize"
          >
            {value}
          </Badge>
        );
      case 'action':
        return (
          <div className="flex items-center gap-1">
            {enableInlineEdit && column.editable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startEdit(row.id, column.key, value)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return (
          <div
            className={cn(
              "cursor-pointer",
              enableInlineEdit && column.editable && "hover:bg-muted/50 rounded px-2 py-1"
            )}
            onClick={() => enableInlineEdit && column.editable && startEdit(row.id, column.key, value)}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {title && <CardTitle className="flex items-center gap-2">
              {realTimeUpdates && <div className="w-2 h-2 bg-success rounded-full animate-pulse" />}
              {title}
            </CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button size="sm" variant="outline" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {enableExport && onExport && (
              <Button size="sm" variant="outline" onClick={onExport}>
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">
              {selectedRows.size} row(s) selected
            </span>
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(Array.from(selectedRows))}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Selected
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                {enableSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={toggleAllSelection}
                    />
                  </TableHead>
                )}
                {expandableRows && <TableHead className="w-12"></TableHead>}
                {columns.filter(col => visibleColumns.has(col.key)).map((column) => (
                  <TableHead 
                    key={column.key}
                    className={cn(
                      column.sortable && "cursor-pointer hover:bg-muted/50",
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={cn(
                              "w-3 h-3",
                              sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          />
                          <ChevronDown 
                            className={cn(
                              "w-3 h-3 -mt-1",
                              sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <>
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {enableSelection && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(row.id)}
                          onCheckedChange={() => toggleRowSelection(row.id)}
                        />
                      </TableCell>
                    )}
                    {expandableRows && (
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleRowExpansion(row.id)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown 
                            className={cn(
                              "w-4 h-4 transition-transform",
                              expandedRows.has(row.id) && "rotate-180"
                            )}
                          />
                        </Button>
                      </TableCell>
                    )}
                    {columns.filter(col => visibleColumns.has(col.key)).map((column) => (
                      <TableCell key={`${row.id}-${column.key}`}>
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandableRows && expandedRows.has(row.id) && renderExpandedRow && (
                    <TableRow>
                      <TableCell colSpan={columns.length + (enableSelection ? 1 : 0) + 1}>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          {renderExpandedRow(row)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
