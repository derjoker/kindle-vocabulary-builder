import mongoose from 'mongoose'

mongoose.Promise = Promise

const DATABASE = 'kindle-vocabulary-builder'

const isProd = process.env.NODE_ENV === 'production'

// connection or db
export default function connect (env) {
  let database
  if (isProd) database = DATABASE
  else database = `${DATABASE}-${env || 'dev'}`
  const uri = `mongodb://localhost:27017/${database}`
  mongoose.connect(uri, { useNewUrlParser: true })
  const connection = mongoose.connection
  connection.on('error', console.error.bind(console, 'connection error:'))

  return connection
}
