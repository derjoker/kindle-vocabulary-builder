const { ApolloServer, gql } = require('apollo-server')

const vocabs = [
  {
    id: 'CR!0P0PDVDA5N7H3A3E3BB7B242CC4T:Aa8EAAAJAAAA:34862:12',
    usage: 'Da waren Pensionen, vollgestopft mit Menschen, Zimmer, vollgestopft mit Fragen. ',
    word: 'Pensionen',
    stem: 'Pension',
    lang: 'de',
    title: 'Die Bücherdiebin: Roman (German Edition)'
  }
]

const typeDefs = gql`
type Vocab {
  id: ID!
  usage: String
  word: String
  stem: String
  lang: String
  title: String
}

type Query {
  vocabs: [Vocab]
}
`

const resolvers = {
  Query: {
    vocabs: () => vocabs
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
