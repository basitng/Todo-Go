import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import instance from "../utils/axios";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated =
        window.sessionStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = {
        id: "",
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: "",
        email: "",
      };

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    try {
      const loginResponse = await instance.post(
        "/auth/jwt/login",
        {
          username: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = loginResponse.data.access_token;
      localStorage.setItem("accessToken", accessToken);
      window.sessionStorage.setItem("authenticated", "true");

      const userResponse = await instance.get("/users/me");

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: userResponse.data,
      });
    } catch (err) {
      console.error(err);
      throw new Error("Email or password not found");
    }
  };

  const signUp = async (email, password) => {
    console.log("🚀 ~ file: auth-context.js:141 ~ signUp ~ email:", email);
    try {
      await instance.post("/auth/register", {
        email: email,
        password: password,
      });
    } catch (err) {
      console.error(err);
      throw new Error("Server ERROR");
    }
  };

  const signOut = async () => {
    instance.post("/auth/jwt/logout").then(() =>
      dispatch({
        type: HANDLERS.SIGN_OUT,
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
