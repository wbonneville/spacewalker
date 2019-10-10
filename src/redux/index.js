import { combineReducers } from "redux";
import planetGeneration from "./planet.reducer";
import selectPlanet from "./selectPlanet.reducer";
import marketGeneration from "./market.reducer";
import playerGeneration from "./player.reducer";
import planetWarp from "./warp.reducer";
import currentPlanet from "./currentPlanet.reducer";

const allReducers = combineReducers({
  planets: planetGeneration,
  // contains ID which is a string
  selectedPlanet: selectPlanet,
  markets: marketGeneration,
  player: playerGeneration,
  warp: planetWarp,
  currentPlanet: currentPlanet
});

export default allReducers;
