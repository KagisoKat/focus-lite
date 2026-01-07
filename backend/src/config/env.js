export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 5000),
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me"
};

if (!env.databaseUrl) {
    throw new Error("Missing DATABASE_URL");
}
