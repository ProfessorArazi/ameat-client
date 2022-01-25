import AvailableMeals from "./AvailableMeals";

const Meals = (props) => {
  return (
    <div>
      <AvailableMeals meals={props.meals} />
    </div>
  );
};
export default Meals;
