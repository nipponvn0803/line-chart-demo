// @flow
/**
 *
 * StatisticsLineChart
 *
 */

import React from "react";
import { Line } from "react-chartjs-2";
import {
  MenuItem,
  Chip,
  Checkbox,
  ListItemText,
  TextField,
  Popper,
  Paper,
  ClickAwayListener
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import CustomizeButton from "./CustomizeButton";
import { chartData } from "./chartData";

const QuickControl = styled.div`
  width: 340px;
  margin: 5px 0 40px 0;
  display: flex;
  justify-content: space-between;
`;

const InviButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  width: 100%;

  :focus {
    outline: 0;
  }
`;

const mobile = window.innerWidth < 420;

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    width: "100%",
    margin: "30px 0"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chart: {
    position: "absolute",
    left: 0,
    top: 0,
    pointerEvents: "none"
  }
}));

const useChipStyles = makeStyles({
  chip: {
    margin: "10px 5px",
    backgroundColor: ({ index }) => colorArray[index],
    border: ({ index }) => `3px solid ${borderArray[index]}`,
    color: "#2E282A",
    "& svg": {
      color: ({ index }) => borderArray[index],
      "&:hover": {
        color: "#fff"
      }
    }
  }
});

const StyledChip = ({ index, label, onDelete }) => {
  const classes = useChipStyles({ index });
  return <Chip label={label} className={classes.chip} onDelete={onDelete} />;
};

// see const datasets below to see how colors are assigned
// array of colors for chart border
let borderArray = [
  "rgba(2,166,118)",
  "rgba(216,43,3)",
  "rgba(246,194,86)",
  "rgba(49,174,192)",
  "rgb(57,0,153)",
  "rgb(229,244,227)",
  "rgb(11,0,51)",
  "rgb(62,0,12)",
  "rgb(177,193,192)"
];
// fill color with opacity 0.3
let colorArray = [
  "rgba(2,166,118,0.3)",
  "rgba(216,43,3,0.3)",
  "rgba(246,194,86,0.3)",
  "rgba(49,174,192,0.3)",
  "rgb(57,0,153,0.3)",
  "rgb(229,244,227,0.3)",
  "rgb(11,0,51,0.3)",
  "rgb(62,0,12,0.3)",
  "rgb(177,193,192,0.3)"
];

function StatisticsLineChart() {
  const classes = useStyles();
  const chart = React.useRef(null);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [selectedTeams, setSelectedTeams] = React.useState([]);
  const [initialDataSet, setInitialData] = React.useState([]);
  const [filterTeamsArray, setFilterTeams] = React.useState([]);
  const [teamsFilterValue, setTeamsFilter] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const teamListOpen = Boolean(anchorEl);

  const labels = [
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00"
  ];

  const datasets = chartData.map(data => ({
    // background and border color will be repeated when all colors have been used
    // colorArray and borderArray need to have the same length
    backgroundColor: colorArray[chartData.indexOf(data) % colorArray.length],
    // use colorArray in case 2 arrays do not have the same length, the first few ones still work
    borderColor: borderArray[chartData.indexOf(data) % colorArray.length],
    borderWidth: 3,
    data: data.values,
    label: data.label
  }));

  const findObjectByLabel = label => {
    let result = datasets.filter(obj => {
      return obj.label === label;
    });
    return result[0];
  };

  const data = {
    datasets,
    labels
  };

  const chartOptions = {
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          ticks: {
            color: "#000",
            beginAtZero: true,
            callback: function(value) {
              if (value % 1 === 0) {
                return value;
              }
            }
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            color: "#000"
          }
        }
      ]
    }
  };

  React.useEffect(() => {
    // wait for the chart to mount
    setTimeout(() => {
      forceUpdate();

      chart.current.chartInstance.data.datasets.map(
        // put all teams as selected
        team => setSelectedTeams(oldArray => [...oldArray, team.label]),
        // save the initial data set with all teams
        setInitialData(chart.current.chartInstance.data.datasets),
        // prepare array of teams to used with filter
        setFilterTeams(chart.current.chartInstance.data.datasets)
      );
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      if (chart.current) {
        // filter out all entries in dataset without label matching any team in selectedTeams array
        chart.current.chartInstance.data.datasets = initialDataSet.filter(
          checkIfTeamIsSelected
        );
        // update the chart with new data
        chart.current.chartInstance.update();
      } else {
        return;
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeams]);

  const removeTeam = teamName => {
    setSelectedTeams(selectedTeams.filter(team => team !== teamName));
  };

  const addTeam = teamName => {
    setSelectedTeams([...selectedTeams, teamName]);
  };

  const toggleDisplayTeam = teamName => {
    if (selectedTeams.indexOf(teamName) > -1) {
      removeTeam(teamName);
    } else {
      addTeam(teamName);
    }
  };

  const checkIfTeamIsSelected = team => {
    return selectedTeams.indexOf(team.label) > -1;
  };

  const removeAllTeams = () => {
    setSelectedTeams([]);
  };

  const showAllTeams = () => {
    let teamLabel = [];
    for (let i = 0; i < initialDataSet.length; i++) {
      teamLabel.push(initialDataSet[i].label);
    }
    setSelectedTeams(teamLabel);
  };

  const filterTeam = () => {
    setTeamsFilter(event.target.value);
    let inputLength = event.target.value.length;
    let rawInput = event.target.value.toLowerCase();
    let suggestions = [];
    if (inputLength === 0) {
      setFilterTeams(initialDataSet);
    } else {
      for (const team of initialDataSet) {
        let teamName = team.label.toLowerCase();
        if (teamName.includes(rawInput)) {
          suggestions.push(team);
        }
      }
      setFilterTeams(suggestions);
    }
  };

  const toggleTeamsList = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ width: "100%" }}>
      {chart.current && (
        <>
          <div>
            <InviButton onClick={toggleTeamsList}>
              <TextField
                label="Team filter"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  classes: {
                    underline: classes.fullWidthInput
                  },
                  startAdornment:
                    selectedTeams !== undefined &&
                    selectedTeams.length !== 0 &&
                    selectedTeams.map(team => (
                      <StyledChip
                        key={datasets.indexOf(findObjectByLabel(team))}
                        index={datasets.indexOf(findObjectByLabel(team))}
                        label={team}
                        onDelete={() => removeTeam(team)}
                      />
                    ))
                }}
                onChange={event => filterTeam(event.target.value)}
                value={teamsFilterValue}
              />
            </InviButton>

            <Popper
              open={teamListOpen}
              anchorEl={anchorEl}
              onClose={handleClickAway}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <Paper>
                  {filterTeamsArray !== undefined &&
                    filterTeamsArray.length !== 0 &&
                    filterTeamsArray.map(team => {
                      return (
                        <MenuItem
                          onClick={() => toggleDisplayTeam(team.label)}
                          key={team.label}
                          value={team.label}
                        >
                          <Checkbox
                            style={{
                              color: borderArray[initialDataSet.indexOf(team)]
                            }}
                            checked={selectedTeams.indexOf(team.label) > -1}
                            onChange={() => toggleDisplayTeam(team.label)}
                          />
                          <ListItemText primary={team.label} />
                        </MenuItem>
                      );
                    })}
                </Paper>
              </ClickAwayListener>
            </Popper>
          </div>
          <QuickControl>
            <CustomizeButton primary onClick={showAllTeams}>
              Show all teams
            </CustomizeButton>
            <CustomizeButton onClick={removeAllTeams}>
              Remove all teams
            </CustomizeButton>
          </QuickControl>
        </>
      )}

      <Line
        data={data}
        options={chartOptions}
        width={mobile ? 200 : 800}
        height={mobile ? 250 : 400}
        ref={chart}
        className={classes.chart}
      />
    </div>
  );
}

export default StatisticsLineChart;
