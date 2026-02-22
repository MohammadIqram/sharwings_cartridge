import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { forgotPasswordTemplate } from "../templates/accounts.js";
import EmailHelper from "../helpers/emailHelper.js";

export const updateProfile = async (req, res) => {
    try {
        const profileData = req.body;
        console.log(profileData);
        if (!profileData) {
            return res.status(400).json({
                success: false,
                message: "please provide a valid form data for the profile updation."
            });
        }

        const result = await prisma.user.update(
            {
                where: {
                    id: req.user.id
                },
                data: {
                    name: profileData.name
                }
            }
        );
        console.log('skldfj', result);

        if (result.id) {
            return res.status(200).json({
                success: true,
                message: "profile updated successfully!"
            });
        }

        return res.status(500).json({
            success: false,
            message: "there was some error when updating your profile. Please try again sometime."
        });
    }
    catch (error) {
        console.log('error from the updateProfile controller: ', error.message || error);
        return res.status(500).json({
            success: false,
            message: "some unexpected error occured. Please try again sometime."
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const passwordState = req.body;
        console.log(passwordState);
        if (!passwordState) {
            return res.status(400).json({
                success: false,
                message: "please provide a valid form to update the password"
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) {
            return res.status(404).json({ success: true, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(passwordState.oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(passwordState.newPassword, salt);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.log("error from the changePassword controller");
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}

export const updateCustomerBillingAddress = async (req, res) => {
    try {
        const address = req.body;
        console.log(address);
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "please provide a valid form data for the profile updation."
            });
        }

        const result = await prisma.user.update(
            {
                where: {
                    id: req.user.id
                },
                data: {
                    address: address
                }
            }
        );

        if (result.id) {
            return res.status(200).json({
                success: true,
                message: "Billing address updated successfully!"
            });
        }

        return res.status(500).json({
            success: false,
            message: "there was some error when updating your billing address. Please try again sometime."
        });
    }
    catch (error) {
        console.log('error from the billingAddress controller: ', error.message || error);
        return res.status(500).json({
            success: false,
            message: "some unexpected error occured. Please try again sometime."
        })
    }
}

export const resetPasswordInitiate = async (req, res) => {

    if (!req.body || !req.body?.email) {
        return res.status(400).json({
            success: false,
            message: "enter a valid email ID to reset your password",
        });
    }

    try {
        const email = req.body.email;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                email: true,
                name: true,
                role: true,
            },
        });
    
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user with this email ID was not found. Please check your email ID and try again."
            });
        }
    
        const token = await jwt.sign(
            { email: user.email },
            process.env.PASSWORD_RESET_JWT_SECRET,
            { expiresIn: '1h' }
        );
    
        const resetLink = `${process.env.CLIENT_URL}/reset-password-confirm?token=${token}`;
        const html = EmailHelper.renderTemplate(forgotPasswordTemplate, {
            name: user?.name,
            resetLink: resetLink,
            token: token,
            expiryTime: '1 hour',
        });
    
        const emailHelper = new EmailHelper();
        await emailHelper.sendEmail({
            to: user.email,
            subject: "password reset link",
            text: "your password reset link is here",
            html: html,
        });

        return res.status(200).json({
            success: true,
            message: "email with password reset link has been sent to your email ID. If you where not able to find the email look into your spam folder or try again."
        });
    }
    catch (error) {
        console.log('error from the reset password controller: ', error);
        return res.status(500).json({
            success: false,
            message: "some unexpected error occured. Please try again later."
        });
    }
}

export const resetPasswordConfirm = async (req, res) => {
    
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "It seems like the link is expired. Please request a new one."
            });
        }

        const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message:
                "Password must be at least 8 characters and include uppercase, lowercase and a number.",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.PASSWORD_RESET_JWT_SECRET);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const user = await prisma.user.update(
                {
                    where: {
                        email: decoded.email
                    },
                    data: {
                        password: hashedPassword
                    },
                    select: {
                        email: true
                    }
                }
            )
            if (user.email) {
                return res.status(200).json({
                    success: true,
                    message: "Password for your account has been changed successfully.",
                })
            }
            return res.status(400).json({
                success: false,
                message: "some unexpected error occured when changing your password. Please try again or if the issue persists contact support."
            })
        } catch (err) {
            return res.status(400).json({
                message: "It seems like the link is expired. Please request a new one.",
            });
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "some unexpected error occured. Please try again later."
        })
    }
}