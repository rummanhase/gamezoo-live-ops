import { Helmet } from "react-helmet-async";
import { useEffect, useReducer } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Games from "../comnponents/Games";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { games: action.payload, loading: false, error: null };
    case "FETCH_FAILURE":
      return { games: [], loading: false, error: action.payload };
    default:
      return state;
  }
}

function HomeScreen() {
  const [state, dispatch] = useReducer(reducer, {
    games: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function getAllGames() {
      try {
        const res = await axios.request({
          url: "https://api-ap-south-1.hygraph.com/v2/clgn9fx6j5jao01ug0fee0fyu/master",
          method: "POST",
          data: {
            query: `{games{
              description
              id
              image
              name
              price
              slug
            }}`,
          },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.games });
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE", payload: error.message });
      }
    }

    getAllGames();
  }, []);

  const { games, loading, error } = state;

  console.log(games, loading, error);

  return (
    <>
      <Helmet>
        <title>Gamazooo</title>
      </Helmet>
      <h1>Featured Games</h1>
      <p>Welcome to the world of Games</p>
      <div className='container'>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Row>
            {games.map((games) => (
              <Col key={games.slug} sm={6} md={4} lg={3} className='mb-3'>
                <Games games={games} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}

export default HomeScreen;
