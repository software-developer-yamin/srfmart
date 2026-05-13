"use client";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import type { authClient } from "@/lib/auth-client";

export default function Dashboard({
	session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	const { user } = session;

	return (
		<div className="flex min-h-screen">
			{/* Desktop Sidebar - only for Mod/Admin */}
			{(user.role === "admin" || user.role === "moderator") && (
				<Sidebar role={user.role} />
			)}

			<main
				className={`flex-1 p-4 md:pb-4 ${user.role === "user" ? "pb-20" : ""}`}
			>
				<div className="mx-auto max-w-4xl space-y-6">
					<div className="flex flex-col gap-1">
						<h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
						<p className="text-muted-foreground">
							Welcome back, {user.name} ({user.role})
						</p>
					</div>

					{/* Wallet components will go here in next stories */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-xl border bg-card p-6 shadow-sm">
							<h3 className="font-semibold">Available Points</h3>
							<p className="font-bold text-2xl">{user.availableBalance}</p>
						</div>
					</div>
				</div>
			</main>

			{/* Mobile Bottom Nav - all roles see bottom nav on mobile */}
			<BottomNav role={user.role} />
		</div>
	);
}
