import { CommonActions, NavigationProp, ParamListBase } from "@react-navigation/native";

type NavigationProps = NavigationProp<ParamListBase>;

export const popAndNavigate = (
    navigation: NavigationProps,
    newScreen: string,
    params?: object,
  ) => {
    navigation.dispatch((state: {routes: any[]}) => {
      const routes = state.routes.slice(0, -1); // Remove the current screen
      return CommonActions.reset({
        ...state,
        routes: [...routes, {name: newScreen, params}],
        index: routes.length,
      });
    });
  };