const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const QuoteGenerator = await hre.ethers.getContractFactory("LandRegistry");
  const quoteGen = await QuoteGenerator.deploy();
  await quoteGen.waitForDeployment();

  const address = await quoteGen.getAddress();
  console.log("Contract deployed to:", address);

  const frontendDir = "../frontend/src/constants";
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });

  fs.writeFileSync(
    `${frontendDir}/contractAddress.js`,
    `export const contractAddress = "${address}";\n`
  );

  const abi = JSON.stringify(QuoteGenerator.interface.format("json"), null, 2);
  fs.writeFileSync(`${frontendDir}/abi.json`, abi);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
