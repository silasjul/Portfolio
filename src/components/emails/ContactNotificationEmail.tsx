import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://silab.dk";

export function ContactNotificationEmail({
  name,
  email,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New inquiry from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="120"
              height="auto"
              alt="Silab"
              style={logo}
            />
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>New Contact Form Submission</Heading>

            <Text style={label}>From</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email</Text>
            <Link href={`mailto:${email}`} style={emailLink}>
              {email}
            </Link>

            <Text style={label}>Message</Text>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Quick Actions */}
          <Section style={actions}>
            <Link href={`mailto:${email}`} style={replyButton}>
              Reply to {name}
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This message was sent from the contact form on{" "}
              <Link href={baseUrl} style={footerLink}>
                silab.dk
              </Link>
            </Text>
            <Text style={timestamp}>
              Received: {new Date().toLocaleString("da-DK", { timeZone: "Europe/Copenhagen" })}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden" as const,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
};

const header = {
  backgroundColor: "#0077cc",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const divider = {
  borderColor: "#e6ebf1",
  margin: "0",
};

const content = {
  padding: "32px 40px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 24px 0",
  padding: "0",
};

const label = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "16px 0 4px 0",
};

const value = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 8px 0",
  fontWeight: "500",
};

const emailLink = {
  color: "#0077cc",
  fontSize: "16px",
  textDecoration: "none",
  fontWeight: "500",
};

const messageBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px 20px",
  marginTop: "8px",
  border: "1px solid #e2e8f0",
};

const messageText = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const actions = {
  padding: "24px 40px",
  textAlign: "center" as const,
};

const replyButton = {
  backgroundColor: "#0077cc",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 8px 0",
};

const footerLink = {
  color: "#0077cc",
  textDecoration: "none",
};

const timestamp = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
};

export default ContactNotificationEmail;
