import { pick, omit, defaults, isEqual } from 'lodash'

export default function Facotry (db, name, schema, indexes = []) {
  const Model = db.model(name, schema)

  async function update (doc) {
    const _id = doc._id || doc.id

    if (!_id) throw new Error('doc.id or doc._id undefined')

    doc._id = _id
    const model = new Model(doc)
    const _doc = model.toJSON()
    const _update = omit(pick(_doc, Object.keys(doc)), indexes)
    return Model.findByIdAndUpdate(_id, _update, { new: true })
  }

  async function insert (doc) {
    const model = new Model(doc)

    let found

    const _id = doc._id || doc.id

    if (_id) {
      found = await Model.findById(_id)
    } else if (indexes.length > 0) {
      const condition = pick(model, indexes)
      found = await Model.findOne(condition)
    }

    if (found) {
      const _doc = found.toJSON()
      const _update = defaults({}, _doc, doc)
      return isEqual(_update, _doc) ? found : update(_update)
    }

    return model.save()
  }

  // priority: upserts < database, safe upsert
  async function upsert (docs) {
    if (Array.isArray(docs)) {
      // in parallel [x]
      // return Promise.all(docs.map(upsert))

      // one after another
      const ret = []
      for (let doc of docs) {
        doc = await insert(doc)
        ret.push(doc)
      }
      return ret
    }

    return insert(docs)
  }

  // priority: upserts > database, force upsert (reset)
  // function forceUpsert (docs) {}

  function fetch (ids) {
    return Model.find({
      _id: { $in: ids }
    })
  }

  Model.update = update
  Model.upsert = upsert
  Model.fetch = fetch

  return Model
}
