export const YMarkerLine = ({value, yScale, innerWidth }) => {
    const markerLineY = yScale(value);
    const markerLineX1 = 0;
    const markerLineX2 = innerWidth;
    return (
      <>
        <line
          class="marker-line"
          x1={markerLineX1}
          y1={markerLineY}
          x2={markerLineX2}
          y2={markerLineY}
        />
        <text
          text-anchor="end"
          alignment-baseline="middle"
          x={markerLineX1 - 5}
          y={markerLineY}
        >
          1M
        </text>
      </>
    );
  };