import ejs from "ejs";
import { config } from "../config/config";
import createTransporter from "../config/emailConfig";

const sendEmail = async (
  receiver: string,
  subject: string,
  filePath: string
) => {
  console.log("🚀 ~ sendEmail ~ __dirname:", __dirname);
  // Render the EJS template
  try {
    ejs.renderFile(
      __dirname + filePath,
      { receiver },
      (err: Error | null, data: string) => {
        if (err) {
          console.log(err);
        } else {
          // Mail options
          const mailOptions: {
            from: string;
            to: string;
            subject: string;
            html: string;
          } = {
            from: config.emailUser as string,
            to: receiver,
            subject: subject,
            html: data,
          };

          // Create transporter instance
          const transporter = createTransporter();

          // Send the email
          transporter.sendMail(
            mailOptions,
            (error: Error | null, info: { messageId: string }) => {
              if (error) {
                return {
                  success: false,
                  message: "Error sending email",
                };
              }
              return {
                success: true,
                message: `Email sent: ${info.messageId}`,
              };
            }
          );
        }
      }
    );
  } catch (error) {
    return {
      success: false,
      message: "Error sending email",
    };
  }
};

export default sendEmail;
