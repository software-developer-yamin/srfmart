import { Button } from "@srfmart/ui/components/button";
import { Input } from "@srfmart/ui/components/input";
import { Label } from "@srfmart/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();
	const [pendingVerification, setPendingVerification] = useState<string | null>(
		null
	);
	const [otp, setOtp] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			const { error } = await authClient.signIn.email({
				email: value.email,
				password: value.password,
			});

			if (error) {
				if (error.status === 403) {
					setPendingVerification(value.email);
					await authClient.emailOtp.sendVerificationOtp({
						email: value.email,
						type: "email-verification",
					});
					toast.info("Please verify your email first. A code has been sent.");
				} else {
					toast.error(error.message || error.statusText);
				}
			} else {
				router.push("/dashboard");
				toast.success("Sign in successful");
			}
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(
				() => setResendCooldown(resendCooldown - 1),
				1000
			);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleVerifyOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!pendingVerification) {
			return;
		}
		setIsVerifying(true);

		const { error } = await authClient.emailOtp.verifyEmail({
			email: pendingVerification,
			otp,
		});

		if (error) {
			toast.error(error.message || "Invalid or expired code");
			setIsVerifying(false);
		} else {
			setPendingVerification(null);
			toast.success("Email verified! Signing you in...");
			router.push("/dashboard");
		}
	};

	if (isPending) {
		return <Loader />;
	}

	if (pendingVerification) {
		return (
			<div className="mx-auto mt-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
				<h1 className="mb-2 text-center font-bold text-3xl tracking-tight">
					Verify Email
				</h1>
				<p className="mb-6 text-center text-muted-foreground">
					Enter the 6-digit code sent to{" "}
					<span className="font-semibold text-foreground">
						{pendingVerification}
					</span>
				</p>

				<form className="space-y-4" onSubmit={handleVerifyOtp}>
					<div className="space-y-2">
						<Label htmlFor="otp">Verification Code</Label>
						<Input
							id="otp"
							maxLength={6}
							onChange={(e) => setOtp(e.target.value)}
							placeholder="000000"
							required
							value={otp}
						/>
					</div>

					<Button className="w-full" disabled={isVerifying} type="submit">
						{isVerifying ? "Verifying..." : "Verify & Sign In"}
					</Button>

					<div className="flex flex-col gap-2 pt-2 text-center">
						<Button
							className="text-muted-foreground transition-colors hover:text-primary"
							disabled={resendCooldown > 0}
							onClick={async () => {
								await authClient.emailOtp.sendVerificationOtp({
									email: pendingVerification,
									type: "email-verification",
								});
								setResendCooldown(60);
								toast.success("Code resent");
							}}
							type="button"
							variant="link"
						>
							{resendCooldown > 0
								? `Resend in ${resendCooldown}s`
								: "Resend Code"}
						</Button>
						<Button
							className="text-muted-foreground/60 text-xs transition-colors hover:text-muted-foreground"
							onClick={() => {
								setPendingVerification(null);
								setOtp("");
							}}
							type="button"
							variant="link"
						>
							Back to Sign In
						</Button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<h1 className="mb-6 text-center font-bold text-3xl">Welcome Back</h1>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="email"
									value={field.state.value}
								/>
								{field.state.meta.errors.map((error) => (
									<p className="text-red-500" key={error?.message}>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="password">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Password</Label>
								<Input
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									type="password"
									value={field.state.value}
								/>
								{field.state.meta.errors.map((error) => (
									<p className="text-red-500" key={error?.message}>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<form.Subscribe
					selector={(state) => ({
						canSubmit: state.canSubmit,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<Button
							className="w-full"
							disabled={!canSubmit || isSubmitting}
							type="submit"
						>
							{isSubmitting ? "Submitting..." : "Sign In"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 text-center">
				<Button
					className="text-indigo-600 hover:text-indigo-800"
					onClick={onSwitchToSignUp}
					variant="link"
				>
					Need an account? Sign Up
				</Button>
			</div>
		</div>
	);
}
