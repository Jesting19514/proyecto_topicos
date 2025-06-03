import { useEffect, useState } from "react";
import Product from "../components/Product";
import { initMongoose } from "../lib/mongoose";
import { findAllProducts } from "./api/products";
import Layout from "../components/Layout";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";

export default function Home({ products }) {
  const [phrase, setPhrase] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  const adminEmails = ["jestgxq@gmail.com", "RubenOrtegaRdz@gmail.com"];

useEffect(() => {
  if (
    !isLoading &&
    isAuthenticated &&
    adminEmails.includes(user?.email)
  ) {
    router.push("/adminpanel");
  }
}, [isAuthenticated, isLoading, user]);


  const categoriesNames = [...new Set(products.map((p) => p.categoria))];

  let filteredProducts = products;
  if (phrase) {
    filteredProducts = products.filter((p) =>
      p.nombre.toLowerCase().includes(phrase.toLowerCase()) ||
      p.categoria.toLowerCase().includes(phrase.toLowerCase())
    );
  }
  

  return (
    <Layout>
  <div className="max-w-6xl mx-auto px-4 py-6">
    <div className="mb-8">
      <input
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        type="text"
        placeholder="🔍 Buscar productos..."
        className="w-full bg-white border border-gray-300 rounded-full px-6 py-3 shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
    </div>

    <div className="space-y-12">
      {categoriesNames.map((categoryName) => {
        const productsInCategory = filteredProducts.filter(p => p.categoria === categoryName);
        if (!productsInCategory.length) return null;

        return (
          <section key={categoryName}>
            <h2 className="text-2xl md:text-3xl font-bold capitalize mb-4 text-sky-500">
              {categoryName}
            </h2>
            <div className="flex gap-6 overflow-x-auto snap-x scrollbar-hide py-2 px-1">
              {productsInCategory.map((productInfo) => (
                <div key={productInfo._id} className="min-w-[240px] snap-start">
                  <Product {...productInfo} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  </div>
</Layout>

  );
}

export async function getServerSideProps() {
  await initMongoose();
  const products = await findAllProducts();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
