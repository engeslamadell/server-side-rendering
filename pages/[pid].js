// this is an import to handle file-system
// we know that this import will fail for a regular react app
// nextjs is smart enough during build time to extract only the imports related to client side and ignore others
// this import is part of nodejs environment
import fs from "fs/promises";
import path from "path";

import { Fragment } from "react";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  // because we use fallback true we need a fallback component while the data is ready
  // and this because the user can have a link to this page which will trigger an http request and try to render things on the screen before we have the data
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;

  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const product = data.products.find((product) => product.id === productId);

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// to tell nextjs which dynamic pages should be prerendered
// tell nextjs all possible ids for this dynamic page
export async function getStaticPaths() {
  return {
    paths: [{ params: { pid: "p1" } }],
    fallback: true,
    // you can set fallback: 'blocking' and not need that fallback component at the above page code but this will block the user from seeing any content untill the request is fullfilled
  };
}

export default ProductDetailPage;
