import {
  Transfer as TransferEvent,
  Token as TokenContract
} from '../generated/Token/Token'
import { ipfs, json, Bytes } from '@graphprotocol/graph-ts'

import {
Token, User, TokenMetadata
} from '../generated/schema'

import {
  TokenMetadata as TokenMetadataTemplate
  } from '../generated/templates'

const ipfshash = "QmaXzZhcYnsisuue5WRdQDH6FDvqkLQX1NckLqBYeYYEfm"

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId;
 
    token.tokenURI = "/" + event.params.tokenId.toString() + ".json";
    token.ipfsURI = ipfshash + token.tokenURI;

    TokenMetadataTemplate.create(token.ipfsURI);
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

 export function handleMetadata(file: string, content: Bytes): void {
  let tokenMetadata = new TokenMetadata(file);
  const value = json.fromBytes(content).toObject()
  if (value) {
    const image = value.get('image')
    const name = value.get('name')
    const description = value.get('description')
    const externalURL = value.get('external_url')

    if (name && image && description && externalURL) {
      tokenMetadata.name = name.toString()
      tokenMetadata.image = image.toString()
      tokenMetadata.externalURL = externalURL.toString()
      tokenMetadata.description = description.toString()
    }

    const coven = value.get('coven')
    if (coven) {
      let covenData = coven.toObject()
      const type = covenData.get('type')
      if (type) {
        tokenMetadata.type = type.toString()
      }

      const birthChart = covenData.get('birthChart')
      if (birthChart) {
        const birthChartData = birthChart.toObject()
        const sun = birthChartData.get('sun')
        const moon = birthChartData.get('moon')
        const rising = birthChartData.get('rising')
        if (sun && moon && rising) {
          tokenMetadata.sun = sun.toString()
          tokenMetadata.moon = moon.toString()
          tokenMetadata.rising = rising.toString()
        }
      }
    }
  tokenMetadata.save()
  }
 }
 