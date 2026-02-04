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

interface ConfirmationEmailProps {
  name: string;
  lang?: "en" | "da";
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://silab.dk";

const content = {
  en: {
    preview: "We've received your message",
    greeting: "Hi",
    title: "Thank you for reaching out!",
    body: "We've received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.",
    timeline: "You can typically expect a response within 24 hours.",
    meanwhile: "In the meantime, feel free to explore more about what we do:",
    visitWebsite: "Visit Our Website",
    footer: "This is an automated confirmation. Please do not reply to this email.",
    copyright: "Silab. All rights reserved.",
  },
  da: {
    preview: "Vi har modtaget din besked",
    greeting: "Hej",
    title: "Tak fordi du kontaktede os!",
    body: "Vi har modtaget din besked og sætter pris på, at du tog dig tid til at kontakte os. Vores team vil gennemgå din henvendelse og vende tilbage til dig hurtigst muligt.",
    timeline: "Du kan typisk forvente svar inden for 24 timer.",
    meanwhile: "I mellemtiden er du velkommen til at læse mere om hvad vi laver:",
    visitWebsite: "Besøg vores hjemmeside",
    footer: "Dette er en automatisk bekræftelse. Du bedes ikke svare på denne e-mail.",
    copyright: "Silab. Alle rettigheder forbeholdes.",
  },
};

export function ConfirmationEmail({
  name,
  lang = "en",
}: ConfirmationEmailProps) {
  const t = content[lang];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
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
          <Section style={mainContent}>
            <Heading style={heading}>
              {t.greeting} {name}! 👋
            </Heading>

            <Text style={title}>{t.title}</Text>

            <Text style={bodyText}>{t.body}</Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>⏱️ {t.timeline}</Text>
            </Section>

            <Text style={bodyText}>{t.meanwhile}</Text>

            <Section style={ctaContainer}>
              <Link href={baseUrl} style={ctaButton}>
                {t.visitWebsite}
              </Link>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="80"
              height="auto"
              alt="Silab"
              style={footerLogo}
            />
            <Text style={footerNote}>{t.footer}</Text>
            <Hr style={footerDivider} />
            <Text style={copyright}>
              © {new Date().getFullYear()} {t.copyright}
            </Text>
            <Section style={socialLinks}>
              <Link href="https://linkedin.com/company/silab" style={socialLink}>
                LinkedIn
              </Link>
              <Text style={socialDot}>•</Text>
              <Link href={baseUrl} style={socialLink}>
                Website
              </Link>
            </Section>
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

const mainContent = {
  padding: "40px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "600",
  margin: "0 0 8px 0",
  padding: "0",
};

const title = {
  color: "#0077cc",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 24px 0",
};

const bodyText = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "1.7",
  margin: "0 0 20px 0",
};

const highlightBox = {
  backgroundColor: "#f0f9ff",
  borderRadius: "8px",
  padding: "16px 20px",
  marginBottom: "24px",
  borderLeft: "4px solid #0077cc",
};

const highlightText = {
  color: "#0369a1",
  fontSize: "15px",
  fontWeight: "500",
  margin: "0",
};

const ctaContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const ctaButton = {
  backgroundColor: "#0077cc",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const footerLogo = {
  margin: "0 auto 16px auto",
  opacity: 0.7,
};

const footerNote = {
  color: "#9ca3af",
  fontSize: "13px",
  margin: "0 0 16px 0",
  fontStyle: "italic" as const,
};

const footerDivider = {
  borderColor: "#e5e7eb",
  margin: "16px 0",
};

const copyright = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 12px 0",
};

const socialLinks = {
  textAlign: "center" as const,
};

const socialLink = {
  color: "#0077cc",
  fontSize: "13px",
  textDecoration: "none",
};

const socialDot = {
  color: "#d1d5db",
  display: "inline",
  margin: "0 8px",
  fontSize: "13px",
};

export default ConfirmationEmail;
