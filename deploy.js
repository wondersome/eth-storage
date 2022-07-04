const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    //HTTP://127.0.0.1:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
        // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
        // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        //     encryptedJson,
        //     process.env.PRIVATE_KEY_PASSWORD
        // )
        // wallet = await wallet.connect(provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy() // STOP here! Wait for the contract to deploy // Call the contract to deploy
    await contract.deployTransaction.wait(1)
    console.log(`Contract address is ${contract.address}`)

    //Get number
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)
    const transactionResponse = await contract.store("7") // Call the function on a contract
    const transactionReceipt = await transactionResponse.wait(1) // Wait 1 block to confirm
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated Favorite Nusmber is ${updatedFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })