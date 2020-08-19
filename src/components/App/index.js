import React, { useState } from "react";

import Slider from "../Slider";
import PaymentPlans from "../PaymentPlans";
import initialData from "../../assets/payment-plan-initial.json";

const { availableLoans } = initialData;

export default () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onChange = (event, index) => setSelectedIndex(index);

  return (
    <div className="app-container">
      <Slider
        availableLoans={availableLoans}
        index={selectedIndex}
        onChange={onChange}
      ></Slider>
      <PaymentPlans amount={availableLoans[selectedIndex]}></PaymentPlans>
    </div>
  );
};
