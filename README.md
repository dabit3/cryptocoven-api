## Cryptocoven API

Try it out [here](https://thegraph.com/hosted-service/subgraph/dabit3/cryptocovenapi)

Example query:

```graphql
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

Filtering

```graphql
{
  tokens(
    where: {
      sun_contains: "capricorn"
    }
  ) {
    sun 
    name
  }
}
```

Full text search

```graphql
{
  covenSearch(
    text: "'CRUSH PEARLS IN YOUR FISTS'"
  ) {
    id
    name
    description
  }
}
```
