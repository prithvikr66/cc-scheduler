const axios = require("axios");
const ethers = require("ethers");
const EthDater = require("ethereum-block-by-date");
const { MongoClient } = require("mongodb");

async function connectDB() {
  const uri =
    "mongodb+srv://pkunofficial66:vQKK0tp2BwGvTbyt@cluster0.ipl2iic.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("test");
    const MonthlyBalance = database.collection("MonthlyBalanceModels");
    return MonthlyBalance;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
const walletAddress = "0x15e54c22f4195142222ED7130521E9636EC3cCEC";

const contractAddress = "0x612E1726435fE38dD49A0B35b4065B56f49c8F11";
const numDecimals = 6;

const timestamp = "2024-07-10T13:20:40Z";

// Alchemy API key
const apiKey = "P2xwp8gerO9lweNzM0VvuGWVwt3tr_Pv";

const provider = new ethers.providers.AlchemyProvider(null, apiKey);
const dater = new EthDater(provider);

const main = async () => {
  let block = await dater.getDate(timestamp);
  let blockNum = block.block;

  let abi = ["function balanceOf(address account)"];

  let iface = new ethers.utils.Interface(abi);
  let edata = iface.encodeFunctionData("balanceOf", [walletAddress]);

  let data = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "eth_call",
    params: [
      {
        to: contractAddress,
        data: edata,
      },
      ethers.utils.hexValue(blockNum),
    ],
  });

  let config = {
    method: "post",
    url: `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    const balanceInHex = ethers.BigNumber.from(response.data.result);
    const balance = parseFloat(
      ethers.utils.formatUnits(balanceInHex, numDecimals)
    ).toFixed(2);
    const updatedBalance = (balance / 10 ** 12).toFixed(2);
    // console.log(`Balance: ${updatedBalance}`);

    const MonthlySales = await connectDB();
    const newData = await MonthlySales.insertOne({
      balance: parseFloat(updatedBalance),
      date: timestamp,
    });
    console.log("Success: Balance saved to DB");
  } catch (error) {
    console.error(`Error fetching balance: ${error.message}`);
  }
};

module.exports = async (req, res) => {
    try {
      await runMain();
      res.status(200).json({ message: 'Cron job completed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during the cron job' });
    }
  };
  
const runMain = async () => {
  try {
    await main();
   
  } catch (error) {
    console.log(error);
  
  }
};


