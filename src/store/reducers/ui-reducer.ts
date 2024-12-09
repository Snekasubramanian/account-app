const initialState = {
  flag: false,
};

const reducer = (state:any, action:any) => {
  switch (action.type) {
    case 'Enable':
      return { ...state, flag: true };
    case 'Disable':
      return { ...state, flag: false };
    default:
      return state;
  }
};

export { initialState, reducer };