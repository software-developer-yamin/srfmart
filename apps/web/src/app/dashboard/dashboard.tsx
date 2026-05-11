"use client";
import type { authClient } from "@/lib/auth-client";

export default function Dashboard({
	_session,
}: {
	_session: typeof authClient.$Infer.Session;
}) {
	return null;
}
