import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { Preview } from "react-dnd-multi-backend";
import Piece from "../Piece";
import { itemTypes } from "../../constants";
import styles from "./DraggablePiece.module.css";

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

function DraggablePiece({ height, width, ...rest }) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: itemTypes.PIECE,
      piece: rest.type,
      isSky: rest.isSky,
      from: rest.position,
      height,
      width,
    },
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

DraggablePiece.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  rest: PropTypes.object,
};

export default DraggablePiece;
