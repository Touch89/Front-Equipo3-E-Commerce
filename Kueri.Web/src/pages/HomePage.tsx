import { FeatureGrid } from "../components/home/FeatureGrid";
import { ProductGrid } from "../components/home/ProductGrid";
import { useState, useEffect } from "react";
import { productsApi } from "../api/products";

type HomeProduct = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

export const HomePage = () => {
  const [productos, setProductos] = useState<HomeProduct[]>([]);

  useEffect(() => {
    productsApi
      .getAll()
      .then((data) => {
        console.log("Datos:", data);
        const productosOrganizados = data.map((producto) => ({
          id: producto.id,
          name: producto.nombre,
          description: producto.descripcion,
          price: "$" + producto.precio,
          image: producto.imagen_url,
          category: producto.categoria,
        }));
        setProductos(productosOrganizados);
      })
      .catch((error) => console.log(error));
  }, []);

  const cinturones = productos.filter((producto) => producto.category === "Cinturones");
  const billeteras = productos.filter((producto) => producto.category === "Billeteras");
  const carteras = productos.filter((producto) => producto.category === "Carteras");

  return (
    <div>
      <ProductGrid title="Modelos de Cinturones" products={cinturones} />

      <ProductGrid title="Modelos de Billeteras Caballero" products={billeteras} />

      <ProductGrid title="Modelos de Carteras Dama" products={carteras} />

      <FeatureGrid />
    </div>
  );
};
