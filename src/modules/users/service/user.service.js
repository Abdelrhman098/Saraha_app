import User from '../../../DB/models/user.models.js';
import { encrypt } from '../../../utils/encryption.util.js'
import { decrypt } from '../../../utils/encryption.util.js';
import bcrypt from 'bcrypt';
import { emitter } from '../../../utils/sendEmail.utile.js';

export const signUp = async (req,res) => {
    try{
        const {firstName,lastName,age,email,password,phoneNumber}=req.body
const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return res.status(400).json({ message: "Email already exists" });
        } 
        const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
        const user = await User.create({
            firstName,
            lastName,    
            age,
            email,
            password: hashedPassword,
            phoneNumber: encrypt(phoneNumber),});

            // send Email to user 
           console.log(email);
            emitter.emit("sendEmail",{
                to : email,
                subject : "Welcome to Sarahah App",
                text : `Hello ${firstName},\n\nWelcome to Sarahah App! We're excited to have you on board.\n\nBest regards,\nThe Sarahah Team`
            })

        res.status(201).json({message: "User created successfully", user});
    }catch(error){
        res.status(400).json({message: "Error creating user", error: error.message});
    }
}

export const updateUser = async (req, res) => {

    // update user by save method
//     try {
//         const { userId } = req.params;
//         const { firstName, lastName, age, email } = req.body;
//         const user= await User.findOne({ _id: userId });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         if(firstName) user.firstName = firstName;
//         if(lastName) user.lastName = lastName;        
//         if(age) user.age = age;
//         if(email==user.email){
//             return res.status(400).json({ message: "Email is already in use" });
//         } 
//         user.email = email;
//         await user.save();
//         res.status(200).json({ message: "User updated successfully", user });
//     } catch (error) {
//         res.status(400).json({ message: "Error updating user", error: error.message });
//     }
   // update user by findByIdAndUpdate method
// try {
//         const { userId } = req.params;
//         const { firstName, lastName, age, email } = req.body;
//         const user = await User.findByIdUpdate(userId,
//              { firstName, lastName, age, email },
//               { new: true });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json({ message: "User updated successfully", user });
//     } catch (error) {
//         res.status(400).json({ message: "Error updating user", error: error.message });
//     }
    // update user by updateOne method
try {
        const { userId } = req.params;
        const { firstName, lastName, age, email,password ,phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
        const user =await User.updateOne(
            { _id: userId },    
            {
            firstName,
            lastName,
            age,
            email,
            password: hashedPassword,
            phoneNumber: encrypt(phoneNumber)
            },
        );
        if (user.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(
            { message: "User updated successfully", user }
        )
}catch (error) {
        res.status(400).json({ message: "Error updating user", error: error.message });
    }
}

export const deleteUser= async (req, res) => {
    // delete user by findByIdAndDelete method
    // try {
    //     const { userId } = req.params;
    //     const user = await User.findByIdAndDelete(userId);
    //     if (!user) {
    //         return res.status(404).json({ message: "User not found" });
    //     }
    //     res.status(200).json({ message: "User deleted successfully" });
    // } catch (error) {
    //     res.status(400).json({ message: "Error deleting user", error: error.message });
    // }
    // delete user by deleteOne method
    try {
        const { userId } = req.params;
        const user = await User.deleteOne({ _id: userId });
        if (user.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting user", error: error.message });
    }
}
export const ListUsers = async (req, res) => {
    try {
        const users = await User.find({});
        users.forEach(user => {
            user.phoneNumber = decrypt(user.phoneNumber); 
        });
         if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(400).json({ message: "Error retrieving users", error: error.message });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { email , oldPassword , newPassword } = req.body;
        const user  = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "email or Password is incorrect" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "email or Password is incorrect" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error updating password", error: error.message });
    }
}