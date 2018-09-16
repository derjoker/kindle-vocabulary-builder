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
    delete
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
    delete
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
    delete
  }
}
`

export const BUILD_VOCABS = gql`
mutation BuildVocabs {
  buildVocabs {
    id
  }
}
`

export const WORDS_QUERY = gql`
query Words ($text: String!) {
  words (text: $text) {
    id
    link
    word
    example
    definition
  }
}
`

export const UPDATE_CARD = gql`
mutation UpdateCard ($card: CardInput!) {
  updateCard (card: $card) {
    id
    note
    category
  }
}
`

export const CREATE_LIST = gql`
mutation CreateList ($list: ListInput!) {
  createList (list: $list) {
    id
    name
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
    count
  }
}
`

export const LIST_CARDS_QUERY = gql`
query ListCards ($id: ID!, $limit: Int) {
  listCards (id: $id, limit: $limit) {
    id
    word {
      link
      word
      example
      definition
    }
    note
    category
  }
}
`

export const LIST_CARDS_OLD_QUERY = gql`
query ListCardsOld ($id: ID!, $offset: Int, $limit: Int) {
  listCardsOld (id: $id, offset: $offset, limit: $limit) {
    id
    word {
      link
      word
      example
      definition
    }
    note
    category
  }
}
`

export const EXPORT_CARDS = gql`
mutation ExportCards ($id: ID!) {
  exportCards (id: $id) {
    word {
      link
      word
      example
      definition
    }
    note
  }
}
`

export const UPDATE_STEMS = gql`
mutation UpdateStems ($id: ID!) {
  updateStems (id: $id) {
    id
    stems
  }
}
`
