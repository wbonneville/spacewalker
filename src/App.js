import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// data

import { TECH_LEVELS, POLITICAL_SYSTEMS, NEWS } from "./planetData";

// actions

import { selectPlanet } from "./redux/selectPlanet.action";
import { createPlanet } from "./redux/planet.action";
import { createMarket } from "./redux/market.action";
import { createPlayer } from "./redux/player.action";
import { warpPlayer } from "./redux/warp.action";
import { addPlayerXP } from "./redux/increaseXP.action";

import generatePlanet from "./generatePlanet";

// import render components

import PageTop from "./PageTop";
import PageInfo from "./PageInfo";

// styled components

import {
  GalacticChart,
  Button,
  Container,
  Box,
  BoxTwo,
  CurrentSystem,
  TargetCargo,
  Chart,
  Shipyard,
  Ex,
  ExTwo,
  Stats,
  White,
  AmtBtn,
  AllBtn,
  CargoRowStyle,
  Price
} from "./Styles";

export function App() {
  // dispatch hook
  const dispatch = useDispatch();

  // ref for the canvas
  const canvas = useRef();
  // const newCanvas = useRef();

  // called when app is rendered
  useEffect(() => {
    // loop creates x instances of planets
    for (var i = 0; i < 800; i++) {
      const { planetId, planetData, marketData } = generatePlanet();
      // dispatches action to bring data into the store
      dispatch(createPlanet(planetId, planetData));

      // dispatches action to bring market data into the store
      dispatch(createMarket(planetId, marketData));
    }
  }, [dispatch]);

  // this is the hook that selects planets data from state
  const planets = useSelector(state => state.planets);
  const markets = useSelector(state => state.markets);

  // get player data from the state
  const player = useSelector(state => state.player);

  // selected planets data from the state
  const selectedPlanet = useSelector(state => state.selectedPlanet);
  const selectedPlanetData = planets[selectedPlanet];
  const selectedMarketData = markets[selectedPlanet];

  // current planets data
  const currentPlanetData = planets[player.planetId];
  const currentMarketData = markets[player.planetId];

  useEffect(() => {
    // provides context for the canvas to draw things
    const ctxOne = canvas.current.getContext("2d");

    // this loop takes planets as an argument and for each unique planet do code
    Object.keys(planets).forEach(planetId => {
      // get planet data
      const planet = planets[planetId];

      // set variables to random number on canvas
      const x = planet.x * canvas.current.width;
      const y = planet.y * canvas.current.height;

      // draw planet
      ctxOne.beginPath();
      ctxOne.moveTo(x, y);
      ctxOne.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2);
      // if selected planet is equal to the current planet ID
      if (selectedPlanet === planetId) {
        ctxOne.fillStyle = "#F31B10";
      } else {
        ctxOne.fillStyle = "black";
      }

      ctxOne.fill();
    });
  });

  // CLICK EVENT

  const handleCanvasClick = event => {
    // get mouse coordinates on page
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    // set canvas coordinates
    const canvasX = canvas.current.offsetLeft;
    const canvasY = canvas.current.offsetTop;
    // subtract canvas coordinates from mouse and multiply by 2
    const x = (mouseX - canvasX) * 2;
    const y = (mouseY - canvasY) * 2;

    // loop through planets
    Object.keys(planets).forEach(planetId => {
      // get planet data
      const planet = planets[planetId];
      const planetX = planet.x * canvas.current.width;
      const planetY = planet.y * canvas.current.height;
      const deltaX = Math.abs(x - planetX);
      const deltaY = Math.abs(y - planetY);

      if (deltaX < 4 && deltaY < 4) {
        // dispatch planet selection action with our planet ID

        dispatch(selectPlanet(planetId));
        dispatch(createPlayer(planetId));
      }
    });
  };

  // click warp
  // check selected planets ID set players planet ID to selected planet
  const warp = event => {
    const planetId = selectedPlanet;
    dispatch(warpPlayer(planetId));
    dispatch(addPlayerXP(5));
  };

  return (
    <React.Fragment>
      {/* Render info component */}
      <PageInfo></PageInfo>
      <Container>
        {/* render top component */}
        <PageTop></PageTop>
        <Box className="row">
          <CurrentSystem className="col-xs-3">
            <p>
              Name:{" "}
              {currentPlanetData && (
                <span> {currentPlanetData.planetName}</span>
              )}
            </p>
            <br></br>
            <p>Size:</p>
            <br></br>
            <p>Resource:</p>
            <br></br>
            {/* if currentPlanetData is true (a planet has been clicked) then render the x coordinate*/}
            <p>
              x:
              {currentPlanetData && <span> {currentPlanetData.x}</span>}
            </p>
            <br></br>
            <p>
              y:
              {currentPlanetData && <span> {currentPlanetData.y}</span>}
            </p>
            <br></br>
            {/* if there is a current planet, render the current planets tech level */}
            <p>
              Tech Level:{" "}
              {currentPlanetData && (
                <span> {TECH_LEVELS[currentPlanetData.techLevel]}</span>
              )}
            </p>
            <br></br>
            <p>
              Political System:{" "}
              {currentPlanetData && (
                <span>
                  {" "}
                  {POLITICAL_SYSTEMS[currentPlanetData.politicalSystem]}
                </span>
              )}
            </p>
            <br></br>
            <p>News:</p>
            <br></br>
            <p>Pirates:</p>
            <br></br>
            <p>Police:</p>
            <br></br>
            <p></p>
          </CurrentSystem>

          <TargetCargo className="col-xs-6">
            <div className="row center-xs">
              <div className="col-xs-4">
                <h4>Sell</h4>
              </div>
              <div className="col-xs-4">
                <h4>Buy</h4>
              </div>
              <div className="col-xs-4">
                <h4>Price</h4>
              </div>
            </div>
            <CargoRowStyle className="row center-xs">
              <div className="col-xs-4">
                {currentPlanetData && (
                  <p>
                    {Object.keys(currentMarketData).map(key => (
                      <p className="item">
                        {key}
                        &nbsp; &nbsp;
                        <AmtBtn>{currentMarketData[key]}</AmtBtn>
                        &nbsp;
                        <AllBtn>All</AllBtn>{" "}
                      </p>
                    ))}
                  </p>
                )}
              </div>
              <div className="col-xs-4">
                {selectedPlanetData && (
                  <p>
                    {Object.keys(selectedMarketData).map(key => (
                      <p className="item">
                        {key}
                        &nbsp; &nbsp;
                        <AmtBtn>{selectedMarketData[key]}</AmtBtn>
                        &nbsp;
                        <AllBtn>All</AllBtn>{" "}
                      </p>
                    ))}
                  </p>
                )}
              </div>
              <Price className="col-xs-4">
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
                <p>%</p>
              </Price>
            </CargoRowStyle>
          </TargetCargo>
          <CurrentSystem className="col-xs-3">
            <p>
              Name:{" "}
              {selectedPlanet && <span> {selectedPlanetData.planetName}</span>}
            </p>
            <br></br>
            <p>Size</p>
            <br></br>
            <p>Resource:</p>
            <br></br>
            <p>
              x:
              {selectedPlanetData && <span> {selectedPlanetData.x}</span>}
            </p>
            <br></br>
            <p>
              y:
              {selectedPlanetData && <span> {selectedPlanetData.y}</span>}
            </p>
            <br></br>
            <p>
              Tech Level:{" "}
              {selectedPlanetData && (
                <span> {TECH_LEVELS[selectedPlanetData.techLevel]}</span>
              )}
            </p>
            <br></br>
            <p>
              Political System:{" "}
              {selectedPlanetData && (
                <span>
                  {" "}
                  {POLITICAL_SYSTEMS[selectedPlanetData.politicalSystem]}
                </span>
              )}
            </p>
            <br></br>
            <p>News:</p>
            <br></br>
            <p>Pirates:</p>
            <br></br>
            <p>Police:</p>
            <br></br>
            <p></p>
          </CurrentSystem>
        </Box>
        <div className="row between-xs">
          <White className="col-xs-3">
            {" "}
            <h2>Dock</h2>
          </White>
          <White className="col-xs-3">
            {" "}
            <h2>Cargo Bays</h2>
          </White>
        </div>
        <BoxTwo className="row center-xs">
          <Ex className="col-xs-3">
            <h1>Fuel </h1>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </Ex>
          <Chart className="col-xs-6">
            <GalacticChart
              id="a"
              onClick={handleCanvasClick}
              ref={canvas}
              width={2000}
              height={740}
            />
          </Chart>

          <ExTwo className="col-xs-3">
            <h1>0 / 15 </h1>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </ExTwo>
        </BoxTwo>

        <BoxTwo className="row center-xs">
          <Shipyard className="col-xs-8">
            <Button onClick={warp}>Warp</Button>
          </Shipyard>
        </BoxTwo>
        <Stats className="row center-xs">
          <div className="col-xs-2">
            <h4>
              {" "}
              <strong>XP:</strong> {player.experience}
            </h4>
          </div>
          <div className="col-xs-2">
            <h4>
              <strong>Cash:</strong> {player.credits}
            </h4>
          </div>
          <div className="col-xs-2">
            <h4>Current Costs: 0</h4>
          </div>
          <div className="col-xs-2">
            <h4>
              <strong>Rank:</strong> {player.rank}
            </h4>
          </div>

          <div className="col-xs-2">
            {player.status.normal && (
              <h4>
                <strong>Status:</strong> Good Standing {player.status.normal}
              </h4>
            )}
          </div>
        </Stats>
      </Container>
    </React.Fragment>
  );
}

export default App;
