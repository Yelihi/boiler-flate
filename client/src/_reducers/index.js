import { combineReducers } from "redux"; // store 안에 여러 reducer 들이 있을 가능성이 높다. 이런 reducer 를  합쳐준다.
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
