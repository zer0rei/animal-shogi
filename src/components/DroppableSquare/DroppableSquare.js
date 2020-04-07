import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import { PiecesDispatchContext } from "../../contexts";
import { cls } from "../../helpers";
import { itemTypes } from "../../constants";
import styles from "./DroppableSquare.module.css";

function DroppableSquare({ className, children, position }) {
  const { canMove, move } = useContext(PiecesDispatchContext);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: itemTypes.PIECE,
    drop: (item) => move(item.from, position),
    canDrop: (item) => canMove(item.from, position),
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

DroppableSquare.defaultProps = {
  className: "",
};

DroppableSquare.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
};

export default DroppableSquare;
