import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  driver: null,
  movement: null,
  movements: null,
  origin: null,
  destination: null,
  travelTimeInformation: null
}

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
    setMovement: (state, action) => {
      state.movement = action.payload;
    },
    setMovements: (state, action) => {
      state.movements = action.payload;
    },
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
  },
});

export const { setUser, setDriver, setMovement, setMovements, setOrigin, setDestination, setTravelTimeInformation } = navSlice.actions;

//Selectors
export const selectUser = (state) => state.nav.user;
export const selectDriver = (state) => state.nav.driver;
export const selectMovement = (state) => state.nav.movement;
export const selectMovements = (state) => state.nav.movements;
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;

export default navSlice.reducer;