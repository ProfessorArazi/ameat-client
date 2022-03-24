import { useHistory } from "react-router-dom";
import classes from "./Home.module.css";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

const Home = () => {
  let history = useHistory();
  document.title = "MEATע";

  return (
    <>
      <Header cartButton={false} image={"home"}>
        <h1 className={classes.title}>Ameat</h1>
        <div className={classes.tab1cards}>
          <div
            onClick={() => history.push("/burgers")}
            className={classes.card + " " + classes.card2}
          >
            <h3>אחד פלוס אחד בימי ראשון!</h3>
          </div>
          <div
            onClick={() => history.push("/drinks")}
            className={classes.card + " " + classes.card1}
          >
            <h3>17:00-19:00 Happy Hour</h3>
          </div>
        </div>
      </Header>
      <Footer />
    </>
  );
};
export default Home;
