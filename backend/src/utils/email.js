import SibApiV3Sdk from "sib-api-v3-sdk";

/* =====================================================
   BREVO CLIENT CONFIG
===================================================== */

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* =====================================================
   SEND OTP EMAIL
===================================================== */
export const sendOTPEmail = async (to, otp) => {
  try {
    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME || "MyApp"
      },
      to: [{ email: to }],
      subject: "Verify your email (OTP)",
      htmlContent: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `
    });
  } catch (err) {
    console.error("❌ OTP Email error:", err.message);
    throw err;
  }
};

/* =====================================================
   SEND TEAM LOGIN CREDENTIALS
===================================================== */
export const sendCredentialsEmail = async ({
  to,
  name,
  password,
  role
}) => {
  try {
    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME || "MyApp"
      },
      to: [{ email: to, name }],
      subject: "Your Login Credentials",
      htmlContent: `
        <h2>Welcome to MyApp 🎉</h2>

        <p>Your account has been created by Admin.</p>

        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Role:</strong> ${role}</p>

        <p>
          <a href="http://localhost:5173/login">
            Click here to login
          </a>
        </p>

        <p style="color:red">
          ⚠️ Please change your password after first login
        </p>
      `
    });
  } catch (err) {
    console.error("❌ Credentials Email error:", err.message);
    throw err;
  }
};
