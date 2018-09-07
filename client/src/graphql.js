import gql from 'graphql-tag'

export const VOCAB_QUERY = gql`
query {
  vocabs {
    id
    usage
    word
    stem
    lang
    title
  }
}
`

export const UPSERT_VOCABS = gql`
mutation UpsertVocabs ($vocabs: [VocabInput]!) {
  upsertVocabs (vocabs: $vocabs) {
    id
    usage
    word
    stem
    lang
    title
  }
}
`

export const UPDATE_VOCAB = gql`
mutation UpdateVocab ($vocab: VocabInput!) {
  updateVocab (vocab: $vocab) {
    id
    usage
    word
    stem
    lang
    title
  }
}
`

export const LISTS_QUERY = gql`
query {
  lists {
    id
    name
  }
}
`

export const LIST_QUERY = gql`
query List ($id: ID!) {
  list (id: $id) {
    id
    name
    lang
    title
    stems
    cards {
      id
      word
      example
      definition
      note
      category
    }
  }
}
`
