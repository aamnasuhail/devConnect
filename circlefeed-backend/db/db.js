const mongoose = require("mongoose");
const config = require("../environment/environment");

mongoose.connect(config.MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});
mongoose.set("useFindAndModify", false);

mongoose.connection.on("connected", () => {
    console.log("Connected successfully");
});
mongoose.connection.on("error", (err) => {
    console.log("Error In Connection", err);
    process.exit(1);
});
