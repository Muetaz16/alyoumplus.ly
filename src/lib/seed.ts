import db from "./db";

export async function seedDatabase() {
  try {
    // Ensure Admin User exists
    const adminExists = await db.adminUser.findUnique({
      where: { email: "motaz@gmail.com" },
    });
    if (!adminExists) {
      await db.adminUser.create({
        data: {
          email: "motaz@gmail.com",
          password: "motaz123",
        },
      });
      console.log("Seeded administrator: motaz@gmail.com");
    }

    console.log("Database seeded successfully with administrator account.");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}
