"use client";
import { Home } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
	role: "user" | "moderator" | "admin";
}

interface NavItem {
	href: Route;
	icon: typeof Home;
	label: string;
}

const commonItems: NavItem[] = [
	{ href: "/dashboard", label: "Dashboard", icon: Home },
	// { href: "/dashboard/history", label: "Transaction History", icon: History },
];

const moderatorItems: NavItem[] = [
	/*
	{
		href: "/moderator/withdrawals",
		label: "Withdrawal Queue",
		icon: LayoutDashboard,
	},
	*/
];

const adminItems: NavItem[] = [
	/*
	{
		href: "/admin/distribute",
		label: "Global Distribution",
		icon: ArrowUpCircle,
	},
	{ href: "/admin/users", label: "User Management", icon: Users },
	{
		href: "/admin/withdrawals",
		label: "Managed Withdrawals",
		icon: LayoutDashboard,
	},
	*/
];

export function Sidebar({ role }: SidebarProps) {
	const pathname = usePathname();

	const items: NavItem[] = [
		...commonItems,
		...(role === "moderator" ? moderatorItems : []),
		...(role === "admin"
			? [
					...moderatorItems.filter(
						(mi) => !adminItems.some((ai) => ai.href === mi.href)
					),
					...adminItems,
				]
			: []),
	];

	return (
		<aside className="hidden h-screen w-64 border-r bg-card md:flex md:flex-col">
			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="mb-4 px-2 font-semibold text-muted-foreground text-xs uppercase">
					{role} Navigation
				</div>
				<nav className="flex flex-col gap-1">
					{items.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								className={`flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm transition-colors ${
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
								}`}
								href={item.href}
								key={item.href}
							>
								<Icon className="h-4 w-4" />
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>
		</aside>
	);
}
