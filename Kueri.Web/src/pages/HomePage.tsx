import { FeatureGrid } from "../components/home/FeatureGrid";
import { ProductGrid } from "../components/home/ProductGrid";
import { useState, useEffect } from "react";

export const HomePage = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/productos")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Datos:", data);
        const productosOrganizados = data.map((producto) => ({
          id: producto.id,
          name: producto.nombre,
          description: producto.descripcion,
          price: "$" + producto.precio,
          image: producto.imagen_url,
        }));
        setProductos(productosOrganizados);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>


      <ProductGrid title="Productos Destacados" products={productos} />

      <ProductGrid title="Modelos de Cinturones" products={productos} />

      <ProductGrid title="Modelos de Billeteras Caballero" products={productos} />

      <ProductGrid title="Modelos de Carteras Dama" products={productos} />

      <FeatureGrid />
    </div>
  );
};
