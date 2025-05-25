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
      p.nombre.toLowerCase().includes(phrase.toLowerCase())
    );
  }

  return (
    <Layout>
      <input
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        type="text"
        placeholder="Buscar productos"
        className="bg-gray-200 w-full py-2 px-4 rounded-xl"
      />
      <div>
        {categoriesNames.map((categoryName) => (
          <div key={categoryName}>
            {filteredProducts.find((p) => p.categoria === categoryName) && (
              <div>
                <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  {filteredProducts
                    .filter((p) => p.categoria === categoryName)
                    .map((productInfo) => (
                      <div key={productInfo._id} className="px-5 snap-start">
                        <Product {...productInfo} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
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
