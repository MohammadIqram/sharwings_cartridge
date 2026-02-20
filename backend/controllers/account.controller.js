import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

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