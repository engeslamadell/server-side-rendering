import { useEffect, useState } from "react";
import useSWR from "swr";

// required by useSWR()
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function LastSalesPage(props) {
  const [sales, setSales] = useState(props.sales);
  // const [isLoading, setIsLoading] = useState(false);

  const { data, error } = useSWR(
    "https://nextjs-ssr-3997b-default-rtdb.firebaseio.com/sales.json",
    fetcher,
  );

  useEffect(() => {
    if (data) {
      const transformedSales = [];
      for (const key in data) {
        transformedSales.push({
          id: key,
          userName: data[key].username,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch("https://nextjs-ssr-3997b-default-rtdb.firebaseio.com/sales.json")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       const transformedSales = [];
  //       for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           userName: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }
  //       setSales(transformedSales);
  //       setIsLoading(false);
  //     });
  // }, []);
  if (error) {
    return <p>Failed to load</p>;
  }
  if (!data && !sales) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {sales?.map((sale) => (
        <li key={sale.id}>
          {sale.userName} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}

// we can use both client side fetch and static or ssr generation together
export async function getStaticProps() {
  return fetch(
    "https://nextjs-ssr-3997b-default-rtdb.firebaseio.com/sales.json",
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const transformedSales = [];
      for (const key in data) {
        transformedSales.push({
          id: key,
          userName: data[key].username,
          volume: data[key].volume,
        });
      }
      return { props: { sales: transformedSales } };
    });
}
export default LastSalesPage;
