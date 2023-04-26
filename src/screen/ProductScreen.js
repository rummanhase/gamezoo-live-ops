import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import ListGroup from "react-bootstrap/ListGroup";

function ProductScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  async function getProductById(id) {
    const query = `
      query($id: ID) {
        game(where: { id: $id }) {
          description
          id
          image
          name
          price
          slug
        }
      }
    `;
    const variables = {
      id: id,
    };

    try {
      const response = await axios.post(
        "https://api-ap-south-1.hygraph.com/v2/clgn9fx6j5jao01ug0fee0fyu/master",
        {
          query,
          variables,
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.game;
    } catch (error) {
      console.error("Error fetching product:", error.message);
      throw error;
    }
  }

  // import { getProductById } from "../api"; // assuming you've exported the above function from a separate file

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, product: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x.id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // const { data } = await axios.get(`/api/products/${product._id}`);
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: "FETCH_REQUEST" });

      try {
        const product = await getProductById(id);
        dispatch({ type: "FETCH_SUCCESS", payload: product });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    }

    fetchData();
  }, [id]);

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <Row>
      <Col md={6}>
        <img
          className='img-large'
          src={product.image.image}
          alt={product.name}
        ></img>
      </Col>
      <Col md={3}>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <h1>{product.name}</h1>
          </ListGroup.Item>
          <ListGroup.Item>Pirce : ${product.price}</ListGroup.Item>
          <ListGroup.Item>
            Description:
            <p>{product.description}</p>
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={5}>
        <Card>
          <Card.Body>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <div className='d-grid'>
                  <Button onClick={addToCartHandler} variant='primary'>
                    Add to Cart
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
export default ProductScreen;
