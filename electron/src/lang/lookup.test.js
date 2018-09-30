import lookup from './lookup'

describe('lookup', () => {
  it(
    'Debatte',
    async () => {
      const words = await lookup('de', 'duden', ['Debatte'])
      expect(words).toEqual([
        {
          lang: 'de',
          dict: 'duden',
          stem: 'Debatte',
          entries: [
            {
              link: 'https://www.duden.de/rechtschreibung/Debatte',
              word: 'Debatte, die',
              definitions: [
                {
                  definition: ' lebhafte Diskussion, Auseinandersetzung, Streitgespr&#xE4;ch',
                  examples: [
                    {
                      example: '<li><span><span>eine erregte, lebhafte Debatte ist im Gang</span></span></li>',
                      text: 'eine erregte, lebhafte Debatte ist im Gang'
                    },
                    {
                      example: '<li><span><span>etwas in die Debatte werfen</span></span></li>',
                      text: 'etwas in die Debatte werfen'
                    },
                    {
                      example: '<li><span><span>in eine Debatte eingreifen</span></span></li>',
                      text: 'in eine Debatte eingreifen'
                    }
                  ]
                },
                {
                  definition: ' lebhafte Diskussion, Auseinandersetzung, Streitgespr&#xE4;ch',
                  examples: [
                    {
                      example: '<li><span class="iwtext">etwas zur Debatte stellen</span> (<span class="iw_rumpf_info"><span><a href="https://www.duden.de/rechtschreibung/Diskussion">Diskussion</a></span></span>)</li>',
                      text: 'etwas zur Debatte stellen (Diskussion)'
                    },
                    {
                      example: '<li><span class="iwtext">zur Debatte stehen</span> (<span class="iw_rumpf_info"><span><a href="https://www.duden.de/rechtschreibung/Diskussion">Diskussion</a></span></span>)</li>',
                      text: 'zur Debatte stehen (Diskussion)'
                    }
                  ]
                },
                {
                  definition: ' Er&#xF6;rterung eines Themas im Parlament',
                  examples: [
                    {
                      example: '<span><span>die Debatte &#xFC;ber die Regierungserkl&#xE4;rung dauert an, wird unterbrochen, vertagt, wurde fortgesetzt</span></span>',
                      text: 'die Debatte über die Regierungserklärung dauert an, wird unterbrochen, vertagt, wurde fortgesetzt'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ])
    },
    60000
  )
})
