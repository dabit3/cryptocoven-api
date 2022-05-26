import {
  Transfer as TransferEvent,
  Token as TokenContract
} from '../generated/Token/Token'
import { ipfs, json } from '@graphprotocol/graph-ts'

import {
Token, User
} from '../generated/schema'

const ipfshash = "QmaXzZhcYnsisuue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm"

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId;
 
    token.tokenURI = "/" + event.params.tokenId.toString() + ".json";

    let metadata = ipfs.cat(ipfshash + token.tokenURI);
    if (metadata) {
      const value = json.fromBytes(metadata).toObject()
      if (value) {
        const image = value.get('image')
        const name = value.get('name')
        const description = value.get('description')
        const externalURL = value.get('external_url')

        if (name && image && description && externalURL) {
          token.name = name.toString()
          token.image = image.toString()
          token.externalURL = externalURL.toString()
          token.description = description.toString()
          token.ipfsURI = 'ipfs.io/ipfs/' + ipfshash + token.tokenURI
        }

        const coven = value.get('coven')
        if (coven) {
          let covenData = coven.toObject()
          const type = covenData.get('type')
          if (type) {
            token.type = type.toString()
          }

          const birthChart = covenData.get('birthChart')
          if (birthChart) {
            const birthChartData = birthChart.toObject()
            const sun = birthChartData.get('sun')
            const moon = birthChartData.get('moon')
            const rising = birthChartData.get('rising')
            if (sun && moon && rising) {
              token.sun = sun.toString()
              token.moon = moon.toString()
              token.rising = rising.toString()
            }
          }
        }
          
      }
    }
  }

  token.updatedAtTimestamp = event.block.timestamp;
  token.owner = event.params.to.toHexString();
  token.save();
 
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
 }
 