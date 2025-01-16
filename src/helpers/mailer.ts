import nodemailer from 'nodemailer';
import User from '@/models/usermodel';
import bcrypt from 'bcryptjs';

const sendMail = async (email: string, emailType: string, userId: any) => {
    try {
        const hashedTokenForVerification = await bcrypt.hash(userId, 10);
        const hashedTokenforReset = await bcrypt.hash(userId + email, 10);

        if (emailType === 'verify') {
            const user = await User.findOneAndUpdate({ email },
                {
                    verifyToken: hashedTokenForVerification,
                    verifyTokenExpiry: Date.now() + 3600000
                });
        } else if (emailType === 'reset') {
            const user = await User.findOneAndUpdate({ email }, {
                forgotPasswordToken: hashedTokenforReset,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })
        }

        // Now create the instance of the nodemailer transpoter
        const transpoter = nodemailer.createTransport({
            // service: 'gmail',
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_USER ,
                pass: process.env.NODEMAILER_PASSWORD
            }
        })

        // Now create the mail options
        const emailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            html: `<p>Mail from Next Application</p>`
        }
        if (emailType === 'verify') {
            emailOptions.subject = 'Email Verification';
            emailOptions.html = `<p>Please verify your email by clicking the link below:</p>
                 <a href="${process.env.BASE_URL}/verifyemail?token=${hashedTokenForVerification}">Verify Email</a>
                 <br/>
                 <p> or just copy paste the below link in your browser: </p>
                 ${process.env.BASE_URL}/verifyemail/?token=${hashedTokenForVerification}`;
        } else if (emailType === 'reset') {
            emailOptions.subject = 'Password Reset';
            emailOptions.html = `<p>Please reset your password by clicking the link below:</p>
                 <a href="${process.env.BASE_URL}/forgotpassword/enternewpassword/?token=${hashedTokenforReset}">Reset Password</a>;
                 <br/>
                 <p> or just copy paste the below link in your browser: </p>
                ${process.env.BASE_URL}/forgotpassword/enternewpassword/?token=${hashedTokenforReset} 
                 `;
        }

        // Send the email
        const mailResponse = await transpoter.sendMail(emailOptions);

        if(mailResponse.accepted){
            return { success: true, message: 'Email sent successfully, Please Check your email' };   
        }
        return { success: false, message: 'Email sent failed' };
    } catch (error: any) {
        console.error("Error in sendMail:", error.message);
        return { success: false, message: error.message };
    }
}

export {
    sendMail
}