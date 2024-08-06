import React from "react";
import Svg, { Path } from "react-native-svg";

const Facebook = () => {
  return (
    <Svg width={20} height={20} viewBox="0 0 16 16" id="facebook">
      <Path
        fill="#1976D2"
        fillRule="evenodd"
        d="M12 5.5H9v-2a1 1 0 0 1 1-1h1V0H9a3 3 0 0 0-3 3v2.5H4V8h2v8h3V8h2l1-2.5z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default Facebook;