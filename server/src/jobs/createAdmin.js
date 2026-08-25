const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artisan_corner";

    await mongoose.connect(mongoURI);

    const args = process.argv.slice(2);
    const name = args[0] || "Artisan Admin";
    const email = args[1] || "admin@artisanscorner.com";
    const password = args[2] || "Mehul$#@123";
    const avatarUrl =
      args[3] ||
      "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user.role = "ADMIN";
      user.name = name;
      user.password = password; // pre-save hook will hash it
      user.avatar = {
        url: avatarUrl,
        publicId: null,
      };
      user.isActive = true;

      await user.save();

      console.log(
        `[Admin Creator] Existing user ${email} upgraded to ADMIN successfully!`,
      );
    } else {
      user = await User.create({
        name,
        email,
        password,
        role: "ADMIN",
        isActive: true,
        avatar: {
          url: avatarUrl,
          publicId: null,
        },
      });

      console.log(`[Admin Creator] New ADMIN user created successfully:
      - Name: ${user.name}
      - Email: ${user.email}
      - Role: ${user.role}
      - Photo: ${user.avatar.url}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("[Admin Creator] Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();