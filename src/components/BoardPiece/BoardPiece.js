import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { Preview } from "react-dnd-multi-backend";
import Piece from "../Piece";
import { itemTypes } from "../../constants";
import styles from "./BoardPiece.module.css";

const PiecePreview = () => {
  const { itemType, item, style } = useContext(Preview.Context);
  return (
    itemType === itemTypes.PIECE && (
      <div style={{ height: item.height, width: item.width, ...style }}>
        <Piece type={item.piece} isSky={item.isSky} style={style} />
      </div>
    )
  );
};

function BoardPiece({ height, width, position, isSkyTurn, result, ...rest }) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: itemTypes.PIECE,
      piece: rest.type,
      isSky: rest.isSky,
      from: position,
      height,
      width,
    },
    canDrag: () => !result.didEnd && isSkyTurn === rest.isSky,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <>
      <div
        className={styles.container}
        ref={drag}
        style={{ opacity: isDragging ? 0.15 : 1 }}
      >
        <Piece {...rest} />
      </div>
      <Preview>
        <PiecePreview />
      </Preview>
    </>
  );
}

BoardPiece.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  isSkyTurn: PropTypes.bool,
  result: PropTypes.object,
  rest: PropTypes.object,
};

export default BoardPiece;
