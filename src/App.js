import React, { Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import CartProvider from "./store/CartProvider";
import ScrollToTop from "./helpers/ScrollToTop ";
import Gifts from "./components/Gifts/Gifts";
import axios from "axios";
const Contact = React.lazy(() => import("./components/Contact/Contact"));
const Meals = React.lazy(() => import("./components/Meals/Meals"));
const Home = React.lazy(() => import("./components/Home/Home"));

function App() {
  const location = useLocation();
  const { pathname } = location;
  const today = new Date();
  const hour = today.getHours();
  const openForDeliveries = hour >= 0 && hour <= 24;

  const [meals, setMeals] = useState([]);
  const [wrongPath, setWrongPath] = useState();

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

  useEffect(() => {
    if (openForDeliveries) {
      axios(process.env.REACT_APP_SERVER + "/meals")
        .then((response) => {
          if (response.data.error) {
            console.log(response.data.error);
          } else {
            const responseData = response.data[0].meals;
            const loadedMeals = [];

            for (const key in responseData) {
              loadedMeals.push({
                id: key,
                name: responseData[key].name,
                description: responseData[key].description,
                price: responseData[key].price,
                image: (
                  <img
                    src={responseData[key].image.props.src}
                    alt={responseData[key].name}
                  />
                ),
                group: responseData[key].group,
                discount: responseData[key].discount,
                twoInOne: responseData[key].twoInOne,
                happyHour: responseData[key].happyHour,
              });
            }
            setMeals(loadedMeals);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [openForDeliveries]);

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
