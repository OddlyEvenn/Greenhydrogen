// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const connectDB = require("./db");

// const userRoutes = require("./routes/userRoutes");
// const creditRoutes = require("./routes/creditRoutes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/credits", creditRoutes);

// // Connect DB and Start Server
// connectDB();
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const creditRoutes = require("./routes/creditRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/credits", creditRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});

const CreditTx = require("./models/CreditTransaction");
const blockchain = require("./services/blockchainService");

function handleAdded(payload) {
  // payload: { user, amount, txHash }
  CreditTx.create({ from: null, to: payload.user.toLowerCase(), amount: payload.amount, txHash: payload.txHash, type: "mint" }).catch(console.error);
}
function handleTransfer(payload) {
  // payload: { from, to, amount, txHash }
  CreditTx.create({ from: payload.from.toLowerCase(), to: payload.to.toLowerCase(), amount: payload.amount, txHash: payload.txHash, type: "transfer" }).catch(console.error);
}

blockchain.listenToEvents(handleAdded, handleTransfer);