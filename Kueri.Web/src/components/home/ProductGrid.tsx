export interface ProductCard {
  id: string | number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface Props {
  title: string;
  products: ProductCard[];
}

export const ProductGrid = ({ title, products }: Props) => {
  return <div className="my-32">
    <h2 className="text-3x1 font-semibold text-center mb-8 md:text-4x1 lg:text-5x1">
      {title}
    </h2>
    <div className="div grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col items-center gap-4">
          <img src={product.image} alt={product.name} className="w-full h-auto" />
          <p className="text-lg font-semibold">{product.name}</p>
          <p className="text-sm text-gray-500">{product.description}</p>
          <p className="text-lg font-bold">{product.price}</p>
        </div>
      ))}
    </div>
  </div>
}