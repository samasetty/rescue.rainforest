import React, { useState, useEffect } from "react";
import "./Slider.css";

const DairySlider = () => {
    const inputFunc = () => {
        let value = document.getElementById("dairyInput").value;
        let te = document.getElementById("dairyText");
        if (value < 10) {
            te.textContent = "0 servings";
        } else if (value < 100) {
            te.textContent = "1 serving";
        } else if (value < 200) {
            te.textContent = "2 servings";
        } else {
            te.textContent = "3 servings";
        }
        
    };

    return (
        <>
        <div class="range">
    <div class="field">
        <div class="value left">
            0</div>
        <input id="dairyInput" type="range" min="0" max="200" steps="1" onChange={inputFunc}/>
        <div class="value right">
            3</div>
    </div>
</div>
<br />

<span className="test" id="dairyText">1 serving</span>

</>
    );
}

export default DairySlider;