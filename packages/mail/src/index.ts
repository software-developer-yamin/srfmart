import { render } from "@react-email/components";
import { env } from "@srfmart/env/server";
import type React from "react";
import type { CreateEmailOptions } from "resend";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(options: CreateEmailOptions) {
	try {
		const { from, ...rest } = options;
		const finalOptions = {
			from: from || env.MAIL_FROM,
			...rest,
		} as CreateEmailOptions;

		if (options.react && !options.html) {
			finalOptions.html = await render(options.react as React.ReactElement);
		}

		const { data, error } = await resend.emails.send(finalOptions);

		if (error) {
			console.error("[MAIL] Error sending email:", error);
			return { success: false, error };
		}

		return { success: true, data };
	} catch (error) {
		console.error("[MAIL] Unexpected error sending email:", error);
		return { success: false, error };
	}
}

export { VerificationEmail } from "./templates/verification";
