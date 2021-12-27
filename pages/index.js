// this is an import to handle file-system
// we know that this import will fail for a regular react app
// nextjs is smart enough during build time to extract only the imports related to client side and ignore others
// this import is part of nodejs environment
import fs from "fs/promises";
import path from "path";

import Link from "next/link";

export default function Home(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

// prepares the props for the components first and send them to the component and then render the component
// this means that nextjs runs this function and then executes the above component function and sends these props to the component
// and it does both in advance during build time
export async function getStaticProps() {
  console.log("regenerating...");
  // here we can write code that runs on the server like accessing file-system.
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  // the next two checks is only to explore all getStaticProps configurations i can have
  // you can also redirect the user to some route based on your business
  if (!data) {
    return {
      redirect: { destination: "some-route" },
    };
  }
  // for example if you fail to get the data you need to pass as props
  if (data.products.length === 0) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
}
