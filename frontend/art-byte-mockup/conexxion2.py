from flask import Flask, request, render_template
import mysql.connector  # O psycopg2 para PostgreSQL o sqlite3 para SQLite
from werkzeug.security import generate_password_hash

app = Flask(__name__)

# Configura la conexión a la base de datos
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",            # Dirección de tu servidor MySQL
        user="usuario",              # Usuario de la base de datos
        password="contraseña",       # Contraseña de tu base de datos
        database="nombre_base_de_datos"  # Nombre de la base de datos
    )

@app.route('/')
def index():
    return render_template('registracion.html')  # Asegúrate de que 'index.html' esté en la carpeta templates

@app.route('/consultar', methods=['POST'])
def registrar():
    # Obtén los datos enviados desde el formulario
    nombre = request.form['Nombre2']
    fechanacimiento = request.form['fecha']
    password = request.form['Contraseña2']
    confirmar_password = request.form['Contraseña3']
    
    # Verificar que las contraseñas coincidan
    if password != confirmar_password:
        return "Las contraseñas no coinciden", 400

    # Cifrar la contraseña para almacenar de forma segura
    password_cifrada = generate_password_hash(password)

    # Conéctate a la base de datos
    conn = get_db_connection()
    cursor = conn.cursor()

    # Realiza la consulta SQL para insertar los datos en la tabla de usuarios
    query = "INSERT INTO usuarios (nombre, estado, fechanacimiento, password) VALUES (%s, %s, %s, %s)"
    values = (nombre, "in progress", fechanacimiento, password_cifrada)

    try:
        cursor.execute(query, values)
        conn.commit()  # Guarda los cambios en la base de datos
        return "Usuario registrado exitosamente"
    except Exception as e:
        return f"Error al registrar: {e}"
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
