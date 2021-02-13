import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import { GameDispatchContext } from "../../contexts";
import { cls } from "../../helpers";
import { itemTypes } from "../../constants";
import styles from "./BoardSquare.module.css";

function BoardSquare({ className, children, position }) {
  const { canMove, move, canDrop: canPieceDrop, drop: dropPiece } = useContext(
    GameDispatchContext
  );
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: itemTypes.PIECE,
    drop: (item) => {
      if (typeof item.from === "object") {
        move(item.from, position);
      } else {
        dropPiece(item.isSky, item.from, position);
      }
    },
    canDrop: (item) => {
      if (typeof item.from === "object") {
        return canMove(item.from, position);
      } else {
        return canPieceDrop(item.isSky, item.from, position);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  return (
    <div
      className={cls(className, {
        [styles.droppable]: canDrop && !isOver,
        [styles.over]: canDrop && isOver,
      })}
      ref={drop}
    >
      {children}
    </div>
  );
}

BoardSquare.defaultProps = {
  className: "",
};

BoardSquare.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
};

export default BoardSquare;
