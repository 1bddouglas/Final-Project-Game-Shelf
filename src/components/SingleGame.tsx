import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoardGame from "../models/BoardGame";
import { singleGameService } from "../services/boardGameAPIService";
import "./SingleGame.css";
import imgNotFound from "../assets/img-not-found.jpg";
import axios from "axios";
import ImageComponant from "./ImageComponent";
import AuthContext from "../context/AuthContext";
import { updateAccountDatabase } from "../services/accountAPIService";

const SingleGame = () => {
  const { account, setAccount } = useContext(AuthContext);
  const [singleGame, setSingleGame] = useState<BoardGame>();
  const [validImage, setValidImage] = useState(false);

  // const navigate = useNavigate();
  const id: string | undefined = useParams().id;

  let cleanText = singleGame?.description_preview?.replace(
    /<\/?[^>]+(>|$)/g,
    ""
  );

  useEffect(() => {
    console.log(id);
    singleGameService(id!).then((res) => {
      setSingleGame(res.games[0]);
    });
  }, [id]);

  console.dir(singleGame?.images.medium);

  const addToWishlistHandler = () => {
    console.log(singleGame);

    if (account && singleGame) {
      const copyOfAccount = { ...account };
      const copyOfWishlist = [...account.wishlist];
      copyOfAccount.wishlist = [...copyOfWishlist, singleGame];
      console.log(copyOfWishlist);

      updateAccountDatabase(copyOfAccount).then((res) => {
        setAccount(res);
      });
    }
  };

  const addToShelfHandler = () => {
    console.log(singleGame);

    if (account && singleGame) {
      const copyOfAccount = { ...account };
      const copyOfShelf = [...account.myShelf];
      copyOfAccount.myShelf = [...copyOfShelf, singleGame];
      console.log(copyOfShelf);

      updateAccountDatabase(copyOfAccount).then((res) => {
        setAccount(res);
      });
    }
  };

  return (
    <>
      {singleGame ? (
        <div className="SingleGame">
          <h2>{singleGame?.name}</h2>
          <ImageComponant src={singleGame?.images.medium!} />
          <button className="shelf-button" onClick={addToShelfHandler}>
            Add to my Shelf
          </button>
          <button className="wishlist-button" onClick={addToWishlistHandler}>
            Add to my Wishlist
          </button>
          <ul>
            {singleGame?.min_players && (
              <li>
                Players: {singleGame?.min_players} - {singleGame?.max_players}
              </li>
            )}
            {singleGame?.min_playtime && (
              <li>
                Playtime: {singleGame?.min_playtime} -{" "}
                {singleGame?.max_playtime}
                mins
              </li>
            )}
            {singleGame?.msrp && <li>Price: ${singleGame?.msrp}</li>}
            {singleGame?.primary_designer.name && (
              <li>Designer: {singleGame?.primary_designer.name}</li>
            )}
          </ul>
          {singleGame?.description_preview && <p>{cleanText}</p>}
        </div>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default SingleGame;
