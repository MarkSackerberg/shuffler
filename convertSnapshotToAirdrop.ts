import * as fs from 'fs';

const inputFile = 'Gt8Afxb9Mx46Vr7EPMFSikqbG28FmGzDBdufNutvKC6q_mint_accounts_holders.json';
const outputFile = 'airdrop_list.json';

type Item = {
  owner_wallet: string;
  mint_account: string;
  metadata_account: string;
  associated_token_address: string;
};

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(`Error reading input file: ${err}`);
    return;
  }

  const items: Item[] = JSON.parse(data.toString());

  const result: {[key: string]: number} = {};

  items.forEach(item => {
    if (item.owner_wallet in result) {
      result[item.owner_wallet]++;
    } else {
      result[item.owner_wallet] = 1;
    }
  });

  fs.writeFile(outputFile, JSON.stringify(result), err => {
    if (err) {
      console.error(`Error writing output file: ${err}`);
      return;
    }

    console.log(`Result saved to ${outputFile}`);
  });
});
