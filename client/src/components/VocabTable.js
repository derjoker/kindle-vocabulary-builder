import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'

class VocabTable extends Component {
  render () {
    const { data, save } = this.props
    const columns = [
      { dataField: 'usage', text: 'Usage', editable: false },
      { dataField: 'word', text: 'Word', editable: false },
      { dataField: 'stem', text: 'Stem' },
      { dataField: 'lang', text: 'Lang', editable: false },
      { dataField: 'title', text: 'Title', editable: false }
    ]
    return (
      <div>
        <BootstrapTable
          keyField='id'
          data={data}
          columns={columns}
          noDataIndication='Table is Empty'
          cellEdit={cellEditFactory({
            mode: 'dbclick',
            blurToSave: true,
            beforeSaveCell: (oldValue, newValue, row, column) => {
              console.log('Before Saving Cell!!')
              console.log(oldValue, newValue, row, column)
              save({
                id: row.id,
                [column.dataField]: newValue
              })
            },
            afterSaveCell: (oldValue, newValue, row, column) => {
              console.log('After Saving Cell!!')
              console.log(oldValue, newValue, row, column)
            }
          })}
          bootstrap4
          striped
          hover
          condensed
        />
      </div>
    )
  }
}

export default VocabTable
