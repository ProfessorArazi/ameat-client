import { useParams } from "react-router";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";
import Card from "../UI/Card";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

const AvailableMeals = (props) => {
  const params = useParams();
  const { food } = params;
  const today = new Date();
  const day = today.getDay();
  const hour = today.getHours();
  const openForDeliveries = hour >= 0 && hour <= 24;

  let updatedMeals = props.meals;

  if (hour >= 17 && hour <= 19 && food === "drinks") {
    updatedMeals = updatedMeals
      .filter((meal) => meal.group === food)
      .sort((a, b) =>
        b.happyHour === a.happyHour
          ? a.price - b.price
          : b.happyHour - a.happyHour
      );
  } else if (day === 0 && food === "burgers") {
    updatedMeals = updatedMeals
      .filter((meal) => meal.group === food)
      .sort((a, b) =>
        b.twoInOne === a.twoInOne
          ? b.discount - a.discount
          : b.twoInOne - a.twoInOne
      );
  } else {
    updatedMeals = updatedMeals
      .filter(
        (meal) => meal.group === food && !meal.happyHour && !meal.twoInOne
      )
      .sort((a, b) => b.discount - a.discount);
  }

  const mealsList = updatedMeals.map((meal) => {
    return (
      <MealItem
        key={meal.id}
        id={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
        image={meal.image}
        group={meal.group}
        discount={meal.discount}
        twoInOne={meal.twoInOne}
        happyHour={meal.happyHour}
      />
    );
  });

  return (
    <>
      <div>
        <Header cartButton={openForDeliveries ? true : false}>
          {openForDeliveries && mealsList.length > 0 && (
            <section className={classes.meals}>
              <Card>
                <ul>{mealsList}</ul>
              </Card>
            </section>
          )}
          {!openForDeliveries && <button>תחכו קצת ישמנים</button>}
        </Header>
      </div>
      <Footer />
    </>
  );
};
export default AvailableMeals;
