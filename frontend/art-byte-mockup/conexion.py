from pymongo import MongoClient,errors

class DatabaseConnection:

  def __init__(self, uri, database, collection):
    self.uri = uri
    self.database = database
    self.collection = collection

  def connection(self):
    try:
      #Establecer la conexión con la base de datos de MongoAtlas
      connectionDB = MongoClient(self.uri)
      #Seleccionar la base de datos de Mongo
      database = connectionDB[self.database]
      #Seleccionar la collection de la base de datos de Mongo
      collection = database[self.collection]
      print("Conexión exitosa a la base de datos: "+self.database)
    except errors.ConnectionFailure as e:
      print("Error en conexión de base de datos: "+str(e))
    return collection

class CrudRepository:
  def __init__(self, collection):
    self.collection = collection

  def createNewItem(self, item):
    self.collection.insert_one(item)

  def createNewItems(self, items):
    self.collection.insert_many(items)

  def readItem(self, query):
    return self.collection.find_one(query)

  def readItems(self, query):
    return self.collection.find(query)


if __name__ == "__main__":
  URI =  "mongodb+srv://cfmunozs:clave@arbyte.da8ej.mongodb.net/?retryWrites=true&w=majority&appName=Arbyte"
  DATABASE = "Artbyte"
  COLLECTION = "Usuario"
  #Conexión a la base de datos
  Crud = CrudRepository(DatabaseConnection(URI, DATABASE, COLLECTION).connection())
  creacion = CrudRepository(DatabaseConnection(URI,"Artbyte","Usuario").connection())

creacion.createNewItem({"nombre": "HOLA QIUE TAL" , 
                         "estado": "IN PROGRESS", 
                         "fechanacimiento": 5454, 
                         "password": "La CONTRASEÑA"})

  

  
