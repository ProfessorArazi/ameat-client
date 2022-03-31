import React, { Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import CartProvider from "./store/CartProvider";
import { menu } from "./components/Meals/menu.jsx";
import ScrollToTop from "./helpers/ScrollToTop ";
import Gifts from "./components/Gifts/Gifts";
const Contact = React.lazy(() => import("./components/Contact/Contact"));
const Meals = React.lazy(() => import("./components/Meals/Meals"));
const Home = React.lazy(() => import("./components/Home/Home"));

/*
todo:
1.home page
2.gifts page
*/

function App() {
  const location = useLocation();
  const { pathname } = location;
  const today = new Date();
  const hour = today.getHours();
  const openForDeliveries = hour >= 0 && hour <= 24;

  const [meals, setMeals] = useState([]);
  const [wrongPath, setWrongPath] = useState();

  useEffect(() => {
    if (openForDeliveries) {
      // const loadedMeals = [];
      // menu.forEach((product) => {
      //   loadedMeals.push({
      //     id: product.id,
      //     name: product.name,
      //     description: product.description,
      //     price: product.price,
      //     image: (
      //       <img src={product.image.props.src} alt={product.image.props.alt} />
      //     ),
      //     group: product.group,
      //     discount: product.discount,
      //     twoInOne: product.twoInOne,
      //     happyHour: product.happyHour,
      //   });
      // });
      setMeals(menu);
    }
  }, [openForDeliveries]);

  useEffect(() => {
    const paths = [
      "/",
      "/burgers",
      "/stakes",
      "/shnitzels",
      "/addones",
      "/drinks",
      "/contact",
      "/gifts",
    ];
    if (!paths.includes(pathname)) {
      document.title = "404";
      setWrongPath("404");
      return;
    } else {
      if (pathname === "/") {
        document.title = "עMEAT";
        setWrongPath(null);
      } else {
        document.title = pathname[1].toUpperCase() + pathname.slice(2);
        setWrongPath(null);
      }
    }
  }, [pathname]);

  return (
    <>
      <CartProvider>
        <ScrollToTop>
          {wrongPath && <Redirect to="/" />}
          {!wrongPath && (
            <Switch>
              <Route path="/" exact>
                <Suspense fallback={<p></p>}>
                  <Home />
                </Suspense>
              </Route>

              <Route path="/gifts" exact>
                {sessionStorage.getItem("token") ? (
                  <Gifts />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route path="/contact" exact>
                <Suspense fallback={<p></p>}>
                  <Contact />
                </Suspense>
              </Route>
              <Route path="/:food">
                <Suspense fallback={<p></p>}>
                  <Meals meals={meals} />
                </Suspense>
              </Route>
            </Switch>
          )}
        </ScrollToTop>
      </CartProvider>
    </>
  );
}

export default App;
