import React from "react";
import MaterialSlider from "@material-ui/lab/Slider";

export default ({ onChange, availableLoans, index }) => {
  return (
    <div className="row slider-container">
      <div className="cell slider">
        <MaterialSlider
          value={index}
          min={0}
          max={availableLoans.length - 1}
          step={1}
          onChange={onChange}
        />
      </div>
      <div className="cell">{availableLoans[index]}</div>
    </div>
  );
};
