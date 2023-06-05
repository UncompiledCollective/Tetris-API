const config = {
    user: "root",
    password: "haslo",
    server: "localhost:3306",
    database: "tetris",
    options: {
        trustedConnection: true,
        enableArithPort: true,
        instanceName: "Local instance MySQL80"
    },
    port:3306
}
module.exports = config;