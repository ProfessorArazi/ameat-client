import burgersImage from "../../assets/burgers.jpg";
import steakImage from "../../assets/steak.jpg";
import addonesImage from "../../assets/chips.jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Typewriter from "typewriter-effect";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import HeaderCartButton from "./HeaderCartButton";
import classes from "./Header.module.css";
import Cart from "../Cart/Cart";
import Member from "../Member/Member";
import { useState, useContext, useEffect } from "react";
import AmeatContext from "../../store/ameat-context";

const Header = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [cartIsShown, setCartIsShown] = useState(false);
  const [memberIsShown, setMemberIsShown] = useState(false);
  const ctx = useContext(AmeatContext);

  const showCartHandler = () => {
    setCartIsShown(!cartIsShown);
    setExpanded(false);
    setMemberIsShown(false);
  };

  const hideAllHandler = () => {
    setCartIsShown(false);
    setExpanded(false);
    setMemberIsShown(false);
  };

  const showMemberHandler = () => {
    setCartIsShown(false);
    setExpanded(false);
    setMemberIsShown(!memberIsShown);
  };

  const toggleHandler = () => {
    setExpanded(expanded ? false : "expanded");
    setMemberIsShown(false);
  };

  useEffect(() => {
    if (ctx.items.length > 0) {
      sessionStorage.setItem("items", JSON.stringify(ctx.items));
    } else if (sessionStorage.getItem("items")) {
      const items = JSON.parse(sessionStorage.getItem("items"));
      ctx.updateItems(items);
      ctx.updateTotalAmount(
        items.length === 1
          ? items[0].price * items[0].amount
          : items.reduce((a, b) => a.price * a.amount + b.price * b.amount)
      );
    }
  }, [ctx]);

  const images = {
    burgers: burgersImage,
    stakes: steakImage,
    addones: addonesImage,
  };

  return (
    <>
      <Navbar expanded={expanded} sticky="top" bg="light" expand="lg" dir="rtl">
        <Container>
          <Navbar.Brand onClick={hideAllHandler} as={Link} to="/">
            עMEAT
          </Navbar.Brand>
          {props.cartButton && <HeaderCartButton onClick={showCartHandler} />}
          <Navbar.Toggle
            onClick={toggleHandler}
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse className={classes.collapse} id="basic-navbar-nav">
            <Nav className="ml-auto">
              {!sessionStorage.getItem("token") && (
                <Nav.Link className="ml-auto" onClick={showMemberHandler}>
                  הצטרף למועדון
                </Nav.Link>
              )}
              {sessionStorage.getItem("token") && (
                <Nav.Link
                  className="ml-auto"
                  onClick={hideAllHandler}
                  as={NavLink}
                  to="/gifts"
                >
                  המתנות שלי
                </Nav.Link>
              )}
              <Nav.Link
                className="ml-auto"
                onClick={hideAllHandler}
                as={NavLink}
                to="/burgers"
              >
                המבורגרים
              </Nav.Link>
              <Nav.Link
                className="ml-auto"
                onClick={hideAllHandler}
                as={NavLink}
                to="/stakes"
              >
                סטייקים
              </Nav.Link>
              <Nav.Link
                className="ml-auto"
                onClick={hideAllHandler}
                as={NavLink}
                to="/shnitzels"
              >
                שניצלים
              </Nav.Link>
              <Nav.Link
                className="ml-auto"
                onClick={hideAllHandler}
                as={NavLink}
                to="/addones"
              >
                תוספות
              </Nav.Link>
              <Nav.Link
                className="ml-auto"
                onClick={hideAllHandler}
                as={NavLink}
                to="/drinks"
              >
                שתייה
              </Nav.Link>
              <Nav.Link
                className="ml-auto"
                onClick={hideAllHandler}
                as={NavLink}
                to="/contact"
              >
                דברו איתנו
              </Nav.Link>
              {sessionStorage.getItem("token") && (
                <Nav.Link
                  className="ml-auto"
                  onClick={() => {
                    ctx.clearCart();
                    sessionStorage.removeItem("token");
                    hideAllHandler();
                  }}
                  as={Link}
                  to="/"
                >
                  התנתק
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {cartIsShown && <Cart onClose={hideAllHandler} />}
      {memberIsShown && (
        <Member onClick={() => setExpanded(false)} onClose={hideAllHandler} />
      )}

      <div onClick={hideAllHandler}>{props.children}</div>
      {/* {props.image && (
        <>
          <div className={classes["header-carousel"]}>
            <Carousel
              autoPlay
              infiniteLoop
              swipeable={false}
              showStatus={false}
              interval={5000}
              transitionTime={1000}
              showThumbs={false}
              showArrows={false}
              className={classes["main-image"]}
              onClickItem={() => {
                setExpanded(false);
              }}
            >
              <img src={images.stakes} alt="slide1" />
              <img src={images.burgers} alt="slide2" />
              <img src={images.addones} alt="slide3" />
            </Carousel>
          </div>
        </>
      )} */}
    </>
  );
};
export default Header;
