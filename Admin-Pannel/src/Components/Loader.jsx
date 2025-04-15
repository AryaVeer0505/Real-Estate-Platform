import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/Animation - 1742321421490.json"

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        style={{ 
          width: 400, 
          height: 400 
        }}
      />
    </div>
  );
};

export default Loader;
