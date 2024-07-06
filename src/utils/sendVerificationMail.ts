import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        const emailResp = await resend.emails.send({
            from: 'prathamshalya@gmail.com',
            to: email,
            subject: 'CodeMonks | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        // Can uncomment after adding resend email facility
        // if(emailResp.error){
        //     throw Error(emailResp.error.message)
        // }
        return {
            success: true,
            message: "Verification email sent successfully"
        }
    } catch (error) {
        console.error("Error while sending verification email")
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}