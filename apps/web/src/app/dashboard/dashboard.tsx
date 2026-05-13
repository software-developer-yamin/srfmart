"use client";
import type { authClient } from "@/lib/auth-client";

export default function Dashboard({
	session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	console.log(session);
	return null;
}
