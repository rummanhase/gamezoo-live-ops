import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import MessageBox from "../components/MessageBox";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CartScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = (item, quantity) => {
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    let user = localStorage.getItem("user");
    localStorage.setItem("price", total);
    if (user) {
      navigate("/payment");
    } else {
      navigate("/signin");
    }
  };

  let total = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <div>
      <Helmet>
        <title>Games Cart</title>
      </Helmet>
      <h1>Shopping Games Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <p>
              Cart is empty. <Link to='/'>Go Shopping</Link>
            </p>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className='align-items-center'>
                    <Col md={4}>
                      <img
                        src={item.image.image}
                        alt={item.name}
                        className='img-fluid rounded img-thumbnail'
                      ></img>{" "}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant='light'
                        disabled={item.quantity === 1}
                      >
                        -
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        variant='light'
                      >
                        +
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={1}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant='light'
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button
                      onClick={checkoutHandler}
                      type='button'
                      variant='primary'
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
