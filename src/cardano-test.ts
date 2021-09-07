import { createCardanoWallet } from "."

const main = async () => {
  const result = await createCardanoWallet()
  console.log(result)
}

main()
