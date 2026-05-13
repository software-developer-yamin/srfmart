"use client";
import { Home } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
	href: Route;
	icon: typeof Home;
	label: string;
}

const navItems: NavItem[] = [
	{ href: "/dashboard", label: "Home", icon: Home },
	// { href: "/dashboard/history", label: "Ledger", icon: History },
	// { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function BottomNav({ role }: { role?: string }) {
	const pathname = usePathname();

	const items: NavItem[] =
		role === "user"
			? navItems
			: [{ href: "/dashboard" as Route, label: "Home", icon: Home }];

	return (
		<nav className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background md:hidden">
			<div className="flex h-16 items-center justify-around">
				{items.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;
					return (
						<Link
							className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-colors ${
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-primary"
							}`}
							href={item.href}
							key={item.href}
						>
							<Icon className="h-5 w-5" />
							<span className="font-medium text-[10px]">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
