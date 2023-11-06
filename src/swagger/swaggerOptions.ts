export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Type ORM API",
            version: "1.0.0",
            description: "The apis of the most advanced server",
        },
        servers: [
            {
                url: "http://localhost:4000",
            },
        ],
    },
    apis: ["src/routes/*.ts", "src/routes/*/*.ts"],
};
