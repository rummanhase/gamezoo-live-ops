import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { Store } from "../Store";

function Games({ games }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = (item) => {
    const existItem = cartItems.find((x) => x.id === item.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/games/${games.id}`}>
        <img
          src={games.image.image}
          className='card-img-top'
          alt={games.name}
        />
      </Link>
      <Card.Body>
        <Link to={`/games/${games.id}`}>
          <Card.Title>{games.name}</Card.Title>
        </Link>
        <Card.Text>${games.price}</Card.Text>
        <Button onClick={() => addToCartHandler(games)}>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
export default Games;
