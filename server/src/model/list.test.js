import { List } from '../model'

describe('model list', () => {
  it('update stems', async () => {
    const doc = {
      name: 'Rebengold (German Edition)',
      lang: 'de',
      title: 'Rebengold (German Edition)'
    }

    const list = await List.upsert(doc)
    expect(list.toJSON().stems).toEqual([])

    list.stems = ['Debatte']
    const list2 = await List.update(list)
    expect(list2.toJSON().stems).toEqual(['Debatte'])

    list2.stems = ['Debatte', 'machen']
    const list3 = await List.update(list2)
    expect(list3.toJSON().stems).toEqual(['Debatte', 'machen'])
  })
})
