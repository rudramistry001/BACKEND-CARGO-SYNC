
import { User } from '../model/users/authModel.js';

//Update profile api for modifying name and email
export const updateProfile = async (req, res) => {
    try {
        console.log("Received Request to Update Profile");
        
        const userId = req.params.userId; // Extract the user ID from the URL
        const updates = req.body; // Extract updates from the request body
        
        console.log("User ID:", userId);
        console.log("Update Data:", updates);

        // If the email is being updated, check if it already exists in another user account
        if (updates.email) {
            const existingUser = await User.findOne({ email: updates.email });
            
            // If the email is already used by another user, send an error
            if (existingUser && existingUser._id.toString() !== userId) {
                console.error("Email is already used by another account");
                return res.status(400).json({ message: "Email is already used by another account" });
            }
        }

        // Find the user by ID and update their profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates }, // Update only the fields provided in the body
            { new: true, runValidators: true } // Return the updated document and validate updates
        );

        if (!updatedUser) {
            console.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Updated User:", updatedUser);

        // Respond with only userId, email, and fullname
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                userId: updatedUser._id, // Send only the userId
                email: updatedUser.email, // Send only the email
                fullname: updatedUser.fullname // Send only the fullname
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// // Add a new address
// export const addAddress = async (req, res) => {
//     const { userId } = req.params;
//     const newAddress = req.body;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         await user.addAddress(newAddress); // Using the schema's addAddress method
//         res.status(200).json({ message: 'Address added successfully', addresses: user.addresses });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update an existing address
// export const updateAddress = async (req, res) => {
//     const { userId, addressId } = req.params;
//     const updates = req.body;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const address = user.addresses.id(addressId);
//         if (!address) {
//             return res.status(404).json({ error: 'Address not found' });
//         }

//         Object.assign(address, updates); // Update the address fields
//         await user.save();
//         res.status(200).json({ message: 'Address updated successfully', addresses: user.addresses });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
// //     }
// };

// // Delete an address
// export const deleteAddress = async (req, res) => {
//     const { userId, addressId } = req.params;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         user.addresses.id(addressId).remove(); // Remove the address
//         await user.save();

//         res.status(200).json({ message: 'Address deleted successfully', addresses: user.addresses });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update wishlist
// export const updateWishlist = async (req, res) => {
//     const { userId } = req.params;
//     const { productId, action } = req.body; // `action` can be 'add' or 'remove'

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         if (action === 'add') {
//             await user.addToWishlist(productId);
//         } else if (action === 'remove') {
//             await user.removeFromWishlist(productId);
//         } else {
//             return res.status(400).json({ error: 'Invalid action' });
//         }

//         res.status(200).json({ message: 'Wishlist updated successfully', wishlist: user.wishlist });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update cart
// export const updateCart = async (req, res) => {
//     const { userId } = req.params;
//     const { productId, quantity, action } = req.body; // `action` can be 'add' or 'remove'

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         if (action === 'add') {
//             await user.addToCart(productId, quantity);
//         } else if (action === 'remove') {
//             await user.removeFromCart(productId);
//         } else {
//             return res.status(400).json({ error: 'Invalid action' });
//         }

//         res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
