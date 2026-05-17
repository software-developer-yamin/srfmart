import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import React from "react";

// Prevent IDE/TypeScript/Biome from removing the "unused" React import
// which is required for the email template runtime/tests
const _keepReact = React.createElement;

interface VerificationEmailProps {
	otp: string;
}

export const VerificationEmail = ({ otp }: VerificationEmailProps) => (
	<Html>
		<Head />
		<Preview>Your verification code for srfmart</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={h1}>Verify your email</Heading>
				<Text style={text}>
					Enter the following verification code to complete your registration.
					This code will expire in 5 minutes.
				</Text>
				<Section style={codeContainer}>
					<Text style={code}>{otp}</Text>
				</Section>
				<Text style={footer}>
					If you didn't request this code, you can safely ignore this email.
				</Text>
			</Container>
		</Body>
	</Html>
);

export default VerificationEmail;

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	maxWidth: "560px",
};

const h1 = {
	color: "#333",
	fontSize: "24px",
	fontWeight: "bold",
	padding: "17px 0 0",
	margin: "0",
};

const text = {
	color: "#333",
	fontSize: "16px",
	lineHeight: "26px",
};

const codeContainer = {
	background: "rgba(0,0,0,.05)",
	borderRadius: "4px",
	margin: "16px auto 14px",
	verticalAlign: "middle",
	width: "280px",
};

const code = {
	color: "#000",
	display: "inline-block",
	fontFamily: "monospace",
	fontSize: "32px",
	fontWeight: 700,
	letterSpacing: "6px",
	lineHeight: "40px",
	paddingBottom: "8px",
	paddingTop: "8px",
	margin: "0 auto",
	width: "100%",
	textAlign: "center" as const,
};

const footer = {
	color: "#898989",
	fontSize: "14px",
	lineHeight: "22px",
	marginTop: "12px",
};
