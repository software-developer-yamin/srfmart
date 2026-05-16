"use client";

import { UserRole } from "@srfmart/auth/client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@srfmart/ui/components/alert-dialog";
import { Badge } from "@srfmart/ui/components/badge";
import { Button } from "@srfmart/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@srfmart/ui/components/dropdown-menu";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@srfmart/ui/components/empty";
import { Input } from "@srfmart/ui/components/input";
import { Skeleton } from "@srfmart/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@srfmart/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@srfmart/ui/components/tabs";
import type {
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import {
	ArrowUpDown,
	ChevronDown,
	MoreHorizontal,
	Search,
	UserPlus,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface User {
	_id: string;
	email: string;
	name?: string;
	phoneNumber?: string;
	referralCode?: string;
	role: UserRole;
}

export default function AdminUsersPage() {
	const [users, setUsers] = React.useState<User[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			referralCode: false,
		});
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [totalUsers, setTotalUsers] = React.useState(0);
	const [rowSelection, setRowSelection] = React.useState({});
	const [searchQuery, setSearchQuery] = React.useState("");
	const [roleFilter, setRoleFilter] = React.useState<string>("all");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const fetchUsers = React.useCallback(
		async (
			query = "",
			role = "all",
			page = 0,
			pageSize = 10,
			sort?: SortingState
		) => {
			setLoading(true);
			try {
				const params = new URLSearchParams();
				if (query) {
					params.append("query", query);
				}
				if (role !== "all") {
					params.append("role", role);
				}
				params.append("page", (page + 1).toString());
				params.append("limit", pageSize.toString());

				if (sort && sort.length > 0) {
					params.append("sortBy", sort[0].id);
					params.append("sortOrder", sort[0].desc ? "desc" : "asc");
				}

				const response = await fetch(`/api/users/search?${params.toString()}`);
				const result = await response.json();

				if (result.success) {
					setUsers(result.data.users ?? []);
					setTotalUsers(result.data.pagination.total);
				} else {
					toast.error(result.error?.message || "Failed to fetch users");
				}
			} catch (e) {
				console.error(e);
				toast.error("An error occurred while fetching users");
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	React.useEffect(() => {
		fetchUsers(
			debouncedSearchQuery,
			roleFilter,
			pagination.pageIndex,
			pagination.pageSize,
			sorting
		);
	}, [
		debouncedSearchQuery,
		roleFilter,
		pagination.pageIndex,
		pagination.pageSize,
		sorting,
		fetchUsers,
	]);

	const handleRoleUpdate = async (userId: string, newRole: string) => {
		try {
			const response = await fetch(`/api/users/${userId}/role`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role: newRole }),
			});
			const result = await response.json();

			if (result.success) {
				toast.success(result.message);
				fetchUsers(
					debouncedSearchQuery,
					roleFilter,
					pagination.pageIndex,
					pagination.pageSize,
					sorting
				);
			} else {
				toast.error(result.error?.message || "Failed to update role");
			}
		} catch (e) {
			console.error(e);
			toast.error("An error occurred while updating role");
		}
	};

	const handleGenerateReferral = async (userId: string) => {
		try {
			const response = await fetch(`/api/users/${userId}/referral-code`, {
				method: "POST",
			});
			const result = await response.json();

			if (result.success) {
				toast.success("Referral code generated");
				fetchUsers(
					debouncedSearchQuery,
					roleFilter,
					pagination.pageIndex,
					pagination.pageSize,
					sorting
				);
			} else {
				toast.error(
					result.error?.message || "Failed to generate referral code"
				);
			}
		} catch (e) {
			console.error(e);
			toast.error("An error occurred while generating referral code");
		}
	};

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "email",
			header: ({ column }) => {
				const isSorted = column.getIsSorted() === "asc";
				const toggleSorting = () => {
					column.toggleSorting(isSorted);
				};
				return (
					<Button
						className="p-0 hover:bg-transparent"
						onClick={toggleSorting}
						variant="ghost"
					>
						Email
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const email = row.getValue("email") as string;
				return <div className="lowercase">{email}</div>;
			},
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => {
				const name = (row.getValue("name") as string) || "N/A";
				return <div>{name}</div>;
			},
		},
		{
			accessorKey: "role",
			header: ({ column }) => {
				const isSorted = column.getIsSorted() === "asc";
				const toggleSorting = () => {
					column.toggleSorting(isSorted);
				};
				return (
					<Button
						className="p-0 hover:bg-transparent"
						onClick={toggleSorting}
						variant="ghost"
					>
						Role
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const role = row.getValue("role") as string;
				let badgeVariant: "destructive" | "default" | "outline" = "outline";
				if (role === UserRole.ADMIN) {
					badgeVariant = "destructive";
				} else if (role === UserRole.MODERATOR) {
					badgeVariant = "default";
				}
				return (
					<Badge className="capitalize" variant={badgeVariant}>
						{role}
					</Badge>
				);
			},
		},
		{
			accessorKey: "referralCode",
			header: "Referral Code",
			cell: ({ row }) => {
				const code = row.getValue("referralCode") as string;
				const role = row.original.role;
				if (!code && (role === UserRole.MODERATOR || role === UserRole.ADMIN)) {
					return (
						<Button
							className="h-8 text-muted-foreground text-xs"
							onClick={() => {
								handleGenerateReferral(row.original._id);
							}}
							size="sm"
							variant="ghost"
						>
							<UserPlus className="mr-2 h-3 w-3" />
							Generate
						</Button>
					);
				}
				const codeValue = code || "-";
				return (
					<code className="rounded bg-muted px-1 font-mono text-xs">
						{codeValue}
					</code>
				);
			},
		},
		{
			accessorKey: "phoneNumber",
			header: "Phone",
			cell: ({ row }) => {
				const phone = (row.getValue("phoneNumber") as string) || "-";
				return <div>{phone}</div>;
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const user = row.original;
				const copyEmail = async () => {
					if (navigator.clipboard) {
						await navigator.clipboard.writeText(user.email);
						toast.success("Email copied to clipboard");
					}
				};
				const setModerator = () => {
					handleRoleUpdate(user._id, UserRole.MODERATOR);
				};
				const setUser = () => {
					handleRoleUpdate(user._id, UserRole.USER);
				};
				const preventDefault = (e: React.SyntheticEvent) => {
					e.preventDefault();
				};

				return (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button className="h-8 w-8 p-0" variant="ghost">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={copyEmail}>
								Copy email address
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuLabel>Change Role</DropdownMenuLabel>
							<AlertDialog>
								<AlertDialogTrigger>
									<DropdownMenuItem onSelect={preventDefault}>
										Set as Moderator
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Change Role?</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to change {user.email}'s role to
											Moderator? This will grant them point distribution powers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={setModerator}>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
							<AlertDialog>
								<AlertDialogTrigger>
									<DropdownMenuItem onSelect={preventDefault}>
										Set as User
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Change Role?</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to change {user.email}'s role to
											User? They will lose any special powers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={setUser}>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable<User>({
		data: users,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		rowCount: totalUsers,
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	const renderTableBody = () => {
		if (loading) {
			return Array.from({ length: 5 }).map((_, i) => {
				const rowKey = `skeleton-row-${i}`;
				return (
					<TableRow key={rowKey}>
						{columns.map((_, j) => {
							const cellKey = `skeleton-cell-${j}`;
							return (
								<TableCell key={cellKey}>
									<Skeleton className="h-6 w-full" />
								</TableCell>
							);
						})}
					</TableRow>
				);
			});
		}

		if (users.length > 0) {
			return table.getRowModel().rows.map((row) => (
				<TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
					{row.getVisibleCells().map((cell) => (
						<TableCell key={cell.id}>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</TableCell>
					))}
				</TableRow>
			));
		}

		return (
			<TableRow>
				<TableCell className="h-24 text-center" colSpan={columns.length}>
					<Empty>
						<EmptyHeader>
							<EmptyTitle>No users found</EmptyTitle>
							<EmptyDescription>Try a different search query.</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="w-full p-8">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">User Management</h1>
					<p className="text-muted-foreground">
						Search users and manage the Moderator hierarchy.
					</p>
				</div>

				<div className="flex flex-col items-start justify-between gap-4 py-4 md:flex-row md:items-center">
					<div className="relative flex max-w-sm flex-1 items-center gap-2">
						<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							className="pl-8"
							onChange={(event) => {
								setSearchQuery(event.target.value);
							}}
							placeholder="Search email or phone..."
							value={searchQuery}
						/>
					</div>

					<div className="flex items-center gap-2">
						<Tabs onValueChange={setRoleFilter} value={roleFilter}>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value={UserRole.ADMIN}>Admins</TabsTrigger>
								<TabsTrigger value={UserRole.MODERATOR}>Moderators</TabsTrigger>
								<TabsTrigger value={UserRole.USER}>Users</TabsTrigger>
							</TabsList>
						</Tabs>

						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button className="ml-auto" variant="outline">
									Columns <ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => (
										<DropdownMenuCheckboxItem
											checked={column.getIsVisible()}
											className="capitalize"
											key={column.id}
											onCheckedChange={(value) => {
												column.toggleVisibility(!!value);
											}}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="rounded-md border bg-slate-900/50">
					<Table>
						<TableHeader className="bg-slate-900">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow className="hover:bg-transparent" key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>{renderTableBody()}</TableBody>
					</Table>
				</div>

				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="flex-1 text-muted-foreground text-xs">
						{table.getFilteredSelectedRowModel().rows.length} of {totalUsers}{" "}
						row(s) selected.
					</div>
					<div className="space-x-2">
						<Button
							disabled={!table.getCanPreviousPage() || loading}
							onClick={() => {
								table.previousPage();
							}}
							size="sm"
							variant="outline"
						>
							Previous
						</Button>
						<Button
							disabled={!table.getCanNextPage() || loading}
							onClick={() => {
								table.nextPage();
							}}
							size="sm"
							variant="outline"
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
