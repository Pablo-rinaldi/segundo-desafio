const fs = require("fs").promises;

class ProductManager {
  static id = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(newObject) {
    let { title, description, price, img, code, stock } = newObject;

    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Faltan ingresar datos");
      return;
    }
    if (this.products.some((prod) => prod.code === code)) {
      console.log("No se puede agregar, Ya existe un producto con ese codigo");
      return;
    }

    const newProduct = {
      id: ++ProductManager.id,
      title,
      description,
      price,
      img,
      code,
      stock,
    };
    this.products.push(newProduct);

    await this.saveFiles(this.products);
  }

  getProducts() {
    console.log(this.products);
  }

  async readFiles() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(res);
      return arrayProductos;
    } catch (error) {
      console.log("no se pudo leer ", error);
    }
  }

  async saveFiles(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("no se pudo guardar el archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.readFiles();
      const res = arrayProductos.find((item) => item.id === id);
      if (res) {
        console.log("encontrado!", res);
        return res;
      } else {
        console.log("no se encontro");
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProductos = await this.readFiles();
      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos[index] = updatedProduct;
        this.products = arrayProductos;
        await this.saveFiles(this.products);
        console.log("se actualizo");
      } else {
        console.log("no se encontro el producto");
      }
    } catch (error) {
      console.log("error al actualizar", error);
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.readFiles();
      const index = arrayProductos.findIndex((item) => item.id === id);
      if (index !== -1) {
        const newProducts = arrayProductos.filter(
          (product) => product.id !== id
        );
        this.products = newProducts;
        await this.saveFiles(this.products);
        console.log("se elimino");
      } else {
        console.log("no se encontro el id del producto");
      }
    } catch (error) {
      console.log("Error al borrar");
    }
  }
}

//Proceso de Testing:

//Se instancia la clase “ProductManager”

const manager = new ProductManager("./products.json");

//Se invoca “getProducts”, debe devolver un array vacío []

manager.getProducts();

/* Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25 */

async function testAddProduct(product) {
  await manager.addProduct(product);
}

async function testAll() {
  const nn = {
    id: 1,
    title: "Bicicleta nn",
    description: "fixed",
    price: 500,
    img: "sin imagen",
    code: "abc125",
    stock: 15,
  };

  const fad = {
    title: "Bicicleta Fad",
    description: "single speed",
    price: 300,
    img: "sin imagen",
    code: "abc123",
    stock: 15,
  };

  const mercury = {
    title: "Bicicleta mercury",
    description: "fixed",
    price: 400,
    img: "sin imagen",
    code: "abc124",
    stock: 15,
  };

  //El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
  await testAddProduct(fad);
  await testAddProduct(mercury);

  //Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
  manager.getProducts();

  //Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
  await manager.getProductById(2);

  //Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
  await manager.updateProduct(1, nn);

  //Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
  await manager.deleteProduct(2);
}

testAll();
