## Cryptocoven API

Try it out [here](https://thegraph.com/hosted-service/subgraph/dabit3/cryptocovenapi)

Example query:

```sh
{
  tokens(first: 5) {
    id
    tokenID
    tokenURI
    externalURL
    image 
    name 
    description
    type 
    sun 
    moon 
    rising 
    updatedAtTimestamp 
    owner {
      id 
    }
  }
}

```