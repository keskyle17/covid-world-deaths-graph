import React, {
  useCallback,
  useState,
  useMemo,
} from 'react';
import {
  scaleTime,
  extent,
  scaleLog,
  max,
  line,
  timeFormat,
  format,
} from 'd3';
import { XAxis } from './XAxis';
import { YAxis } from './YAxis';
import { VoronoiOverlay } from './VoronoiOverlay';

const xValue = (d) => d.date;
const yValue = (d) => d.deathTotal;

const margin = {
  top: 30,
  right: 30,
  bottom: 80,
  left: 100,
};

const formatDate = timeFormat('%B, %d, %Y');
const formatComma = format(',');

export const LineChart = ({ data, width, height }) => {
  const [activeRow, setActiveRow] = useState();

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const allData = useMemo(
    () =>
      data.reduce(
        (accumulator, countryTimeseries) =>
          accumulator.concat(countryTimeseries),
        []
      ),
    [data]
  );

  const xScale = useMemo(
    () =>
      scaleTime()
        .domain(extent(allData, xValue))
        .range([0, innerWidth]),
    [allData, xValue]
  );

  const yScale = useMemo(
    () =>
      scaleLog()
        .domain([1, max(allData, yValue)])
        .range([innerHeight, 0]),
    [allData, xValue]
  );

  const lineGenerator = useMemo(
    () =>
      line()
        .x((d) => xScale(xValue(d)))
        .y((d) => yScale(1 + yValue(d))),
    [xScale, xValue, yScale, yValue]
  );

  const mostRecentDate = xScale.domain()[1];

  const handleVoronoiHover = useCallback(setActiveRow, []);

  const Tooltip = ({ activeRow, className }) => (
    <text
      className={className}
      x={-10}
      y={-10}
      text-anchor={'end'}
    >
      {activeRow.countryName}:
      {formatComma(activeRow.deathTotal)}
      {activeRow.deathTotal > 1 ? ' deaths' : ' death'} as
      of {formatDate(activeRow.date)}
    </text>
  );

  return (
    <svg width={width} height={height}>
      <g
        transform={`translate(${margin.left},${margin.top})`}
      >
        <XAxis xScale={xScale} innerHeight={innerHeight} />
        <YAxis yScale={yScale} innerWidth={innerWidth} />
        {data.map((countryTimeseries) => {
          return (
            <path
              class="marker-line"
              d={lineGenerator(countryTimeseries)}
            />
          );
        })}
        {activeRow ? (
          <>
            <path
              className="marker-line active"
              d={lineGenerator(
                data.find(
                  (countryTimeseries) =>
                    countryTimeseries.countryName ===
                    activeRow.countryName
                )
              )}
            />
            <g
              transform={`translate(${lineGenerator.x()(
                activeRow
              )},${lineGenerator.y()(activeRow)})`}
            >
              <circle r={10} />
              <Tooltip
                activeRow={activeRow}
                className="tooltip-stroke"
              />
              <Tooltip
                activeRow={activeRow}
                className="tooltip"
              />
            </g>
          </>
        ) : null}
        <text
          className="title"
          transform={`translate(${innerWidth / 2 - 150},${
            innerHeight + 40
          })`}
          text-anchor="end"
          alignment-baseline="hanging"
        >
          Coronavirus Deaths By Country
        </text>
        <text
          className="axis-label"
          transform={`translate(-50,${
            innerHeight / 2
          }) rotate(-90)`}
          text-anchor="middle"
        >
          Cumulative Deaths
        </text>
        <text
          className="axis-label"
          transform={`translate(${innerWidth / 2},${
            innerHeight + 40
          })`}
          text-anchor="middle"
          alignment-baseline="hanging"
        >
          Time
        </text>
        <VoronoiOverlay
          margin={margin}
          onHover={handleVoronoiHover}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          allData={allData}
          lineGenerator={lineGenerator}
        />
      </g>
    </svg>
  );
};
