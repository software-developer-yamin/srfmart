import { Button } from "@srfmart/ui/components/button";
import { Input } from "@srfmart/ui/components/input";
import { Label } from "@srfmart/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
		onSubmit: async ({ value }) => {
			setEmail(value.email);
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email: value.email,
				type: "sign-in",
			});

			if (error) {
				toast.error(error.message || "Failed to send verification code");
			} else {
				setStep("otp");
				localStorage.setItem("pending_verification_email", value.email);
				localStorage.setItem(
					"pending_verification_referral",
					value.referralCode
				);
				toast.success("Verification code sent to your email");
			}
		},
	});

	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsVerifying(true);

		const referralCode =
			form.getFieldValue("referralCode") ||
			localStorage.getItem("pending_verification_referral") ||
			"";

		const { error } = await authClient.signIn.emailOtp({
			email,
			otp,
			name: form.getFieldValue("name"),
			referralCode,
		});

		if (error) {
			toast.error(error.message || "Invalid or expired code");
			setIsVerifying(false);
		} else {
			localStorage.removeItem("pending_verification_email");
			localStorage.removeItem("pending_verification_referral");
			toast.success("Account created successfully");
			router.push("/dashboard");
		}
	};

	if (isPending) {
		return <Loader />;
	}

	if (step === "otp") {
		return (
			<div className="mx-auto mt-10 w-full max-w-md p-6">
				<h1 className="mb-2 text-center font-bold text-3xl">Verify Email</h1>
				<p className="mb-6 text-center text-gray-600">
					Enter the 6-digit code sent to {email}
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

					<div className="text-center">
						<Button
							className="text-gray-500"
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
					</div>
					<div className="text-center">
						<Button
							className="text-gray-400 text-xs"
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
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<h1 className="mb-6 text-center font-bold text-3xl">Create Account</h1>

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
									value={field.state.value}
								/>
								{field.state.meta.errors.map((error) => (
									<p className="text-red-500" key={error?.toString()}>
										{error?.toString()}
									</p>
								))}
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
									type="email"
									value={field.state.value}
								/>
								{field.state.meta.errors.map((error) => (
									<p className="text-red-500" key={error?.toString()}>
										{error?.toString()}
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
									<p className="text-red-500" key={error?.toString()}>
										{error?.toString()}
									</p>
								))}
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
								{field.state.meta.errors.map((error) => (
									<p className="text-red-500" key={error?.toString()}>
										{error?.toString()}
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
							{isSubmitting ? "Submitting..." : "Sign Up"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 text-center">
				<Button
					className="text-indigo-600 hover:text-indigo-800"
					onClick={onSwitchToSignIn}
					variant="link"
				>
					Already have an account? Sign In
				</Button>
			</div>
		</div>
	);
}
