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

interface SignUpFormProps {
	onSwitchToSignIn: () => void;
}

export default function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
	const router = useRouter();
	const { isPending } = authClient.useSession();
	const [step, setStep] = useState<"details" | "otp">("details");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);

	useEffect(() => {
		const pendingEmail = localStorage.getItem("pending_verification_email");
		if (pendingEmail) {
			setEmail(pendingEmail);
			setStep("otp");
		}
	}, []);

	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(
				() => setResendCooldown(resendCooldown - 1),
				1000
			);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			referralCode: "",
		},
		validators: {
			onChange: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.string().trim().toLowerCase().email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
				referralCode: z
					.string()
					.min(3, "Referral code must be at least 3 characters")
					.max(20, "Referral code is too long"),
			}),
		},
		onSubmit: async ({ value }) => {
			setEmail(value.email);
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email: value.email,
				type: "email-verification",
			});

			if (error) {
				toast.error(error.message || "Failed to send verification code");
			} else {
				setStep("otp");
				localStorage.setItem("pending_verification_email", value.email);
				toast.success("Verification code sent to your email");
			}
		},
	});

	const handleVerifyOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsVerifying(true);

		const referralCode = form.getFieldValue("referralCode") || "";
		const name = form.getFieldValue("name");
		const password = form.getFieldValue("password");

		const { error } = await authClient.signIn.emailOtp({
			email,
			otp,
			name,
			password,
			referralCode,
		});

		if (error) {
			toast.error(error.message || "Invalid or expired code");
			setIsVerifying(false);
		} else {
			localStorage.removeItem("pending_verification_email");
			toast.success("Account created successfully");
			router.push("/dashboard");
		}
	};

	const FieldError = ({ errors }: { errors: unknown[] }) => {
		if (!errors.length) {
			return null;
		}
		return (
			<div className="space-y-1">
				{errors.map((error, i) => (
					<p
						className="font-medium text-destructive text-sm"
						key={`${i}-${error?.toString()}`}
					>
						{error?.toString()}
					</p>
				))}
			</div>
		);
	};

	if (isPending) {
		return <Loader />;
	}

	if (step === "otp") {
		return (
			<div className="mx-auto mt-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
				<h1 className="mb-2 text-center font-bold text-3xl tracking-tight">
					Verify Email
				</h1>
				<p className="mb-6 text-center text-muted-foreground">
					Enter the 6-digit code sent to{" "}
					<span className="font-semibold text-foreground">{email}</span>
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
						{isVerifying ? "Verifying..." : "Verify"}
					</Button>

					<div className="flex flex-col gap-2 pt-2 text-center">
						<Button
							className="text-muted-foreground transition-colors hover:text-primary"
							disabled={resendCooldown > 0}
							onClick={async () => {
								await authClient.emailOtp.sendVerificationOtp({
									email,
									type: "sign-in",
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
								localStorage.removeItem("pending_verification_email");
								localStorage.removeItem("pending_verification_referral");
								setStep("details");
							}}
							type="button"
							variant="link"
						>
							Back to Sign Up
						</Button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<div className="mx-auto mt-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
			<h1 className="mb-6 text-center font-bold text-3xl tracking-tight">
				Create Account
			</h1>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div>
					<form.Field name="name">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Name</Label>
								<Input
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="John Doe"
									value={field.state.value}
								/>
								<FieldError errors={field.state.meta.errors} />
							</div>
						)}
					</form.Field>
				</div>

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
									placeholder="name@example.com"
									type="email"
									value={field.state.value}
								/>
								<FieldError errors={field.state.meta.errors} />
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
									placeholder="••••••••"
									type="password"
									value={field.state.value}
								/>
								<FieldError errors={field.state.meta.errors} />
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="referralCode">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Referral Code</Label>
								<Input
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter your referral code"
									value={field.state.value}
								/>
								<FieldError errors={field.state.meta.errors} />
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
							{isSubmitting ? "Submitting..." : "Sign Up"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 text-center">
				<Button
					className="text-primary underline-offset-4 hover:underline"
					onClick={onSwitchToSignIn}
					variant="link"
				>
					Already have an account? Sign In
				</Button>
			</div>
		</div>
	);
}
