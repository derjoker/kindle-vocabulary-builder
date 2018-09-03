import gql from 'graphql-tag'

export const VOCAB_QUERY = gql`
{
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
